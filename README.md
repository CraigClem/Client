# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Project 4 : ProjectExpo

# Brief

Build a full-stack application by making your own backend and your own front-end
* **Use a Python Django API** using Django REST Framework to serve your data from a Postgres database
* **Consume your API with a separate front-end** built with React
* **Be a complete product** which most likely means multiple relationships and CRUD functionality for at least a couple of models

# Technologies

### Back-end
* Django 
* Python 
* PostreSQL

### Front-end
* CSS3 + SASS
* HTML5
* Javascript (ES6)
* React.js
* Google Fonts 
* Font Awesome

### Dependencies 
* Pipenv
* Pyjwt
* Django Rest Framework
* Psycopg2-binary
* Pylint
* Axios 
* React-router-dom


### Development Tools 
* Git + GitHub
* Heroku 
* Netlify 
* VS Code
* TablePlus

### Contributers
* Bradley Bernard 
* Gursham Singh

# Approach

As a group we discussed various ideas that we felt would allow us to consolidate and implement the new concepts and languages we had just learned the weeks before in class. Based on a class experience where one of the tutors was showing us previous completed projects Bradley came up with the idea of creating a platform where students from the course could showcase all their projects in one place making it easier for the tutors to show a large selection of projects in place. After looking at various existing sites we started whiteboarding to plan our page layout and the database models. 

# Back-end 

### Models

We began by discussing our models and whiteboading thier relationships to understand which woudl be 1:1, 1:Many and Many:Many. As we only had a week to complete the project we specifically tried to keep our models simple.

_________

With the models established and realtionsips understood, we then began to code the projects models and then the serializers for working with our data in the front-end. 

#### User Model

```py

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.CharField(max_length=50)
    profile_image = models.CharField(max_length=250, default='https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png')
    job_title = models.CharField(max_length=100, blank=True)
    gacohort = models.CharField(max_length=50, blank=True)
    linkedin = models.CharField(max_length=250, blank=True)
    github = models.CharField(max_length=250, blank=True)
    instagram = models.CharField(max_length=250, blank=True)
    twitter = models.CharField(max_length=250, blank=True)
    personalsite= models.CharField(max_length=250, blank=True)
    created_project = models.CharField(max_length= 250, blank=True)

```
#### Project Model

```py
class Project(models.Model):
    project_name = models.CharField(max_length=25)
    url = models.CharField(max_length=300)
    project_type = models.ManyToManyField(
        ProjectType,
        related_name='project',
        blank=True
    )
    favorited_by = models.ManyToManyField(
        'jwt_auth.User',
        related_name='favorites',
        blank= True
    )
    owner = models.ForeignKey(
        'jwt_auth.User',
        related_name='created_projects',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.project_name}'
```

________

### Views 

Once we had finished working on the models we then began working on the CRUD functionality by creating the views for Projects.

```py
class ProjectListView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request):
        project = Project.objects.all()
        serialized_project = PopulatedProjectSerializer(project, many=True)
        return Response(serialized_project.data, status=status.HTTP_200_OK)

    def post(self, request):
        request.data['owner'] = request.user.id
        new_project = ProjectSerializer(data=request.data)
        if new_project.is_valid():
            new_project.save()
            return Response(new_project.data, status=status.HTTP_201_CREATED)
        return Response(new_project.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
```

### Authentication 

Using Djangos rest framework and jwt we created the user authentication.

```py
lass JWTAuthentication(BasicAuthentication):

    def authenticate(self, request):
        header = request.headers.get('Authorization')
        if not header:
            return None
        if not header.startswith('Bearer'):
            raise PermissionDenied({'detail': 'Invalid Authorization Header'})
        token = header.replace('Bearer ', '')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(pk=payload.get('sub'))
        except jwt.exceptions.InvalidTokenError:
            raise PermissionDenied({'detail': 'Invalid Token'})
        except User.DoesNotExist:
            raise PermissionDenied({'detail': 'User Not Found'})

        return (user, token)

```

With the models, serializers and authentication complete, we created a client.http file to test our views before moving on to the front-end of the project.







