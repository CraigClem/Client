import React from 'react'
import { useParams } from 'react-router-dom'

import { getAllProjects } from './components/lib/api'

function Main() {

  const { projectId } = useParams()
  const [projects, setProjects] = React.useState(null)

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllProjects()
        setProjects(response.data)
        
        console.log('working')
        console.log(response.data)
        console.log(projectId)
        console.log(projects)
      } catch (error) {
        console.log('something went wrong')
      }
    }
    getData()
  },[projectId, projects])


  return (
    <h1>Hello!!!</h1>
  )
}

export default Main 
