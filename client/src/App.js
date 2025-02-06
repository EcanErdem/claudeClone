import React, { useEffect, useState } from 'react';
import WelcomePage from './components/WelcomePage';
import ChatContainer from './components/ChatContainer';
import InputBox from './components/InputBox';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {setAllChats,setCurrentChatMessages} from "./state"
import SignUp from '../src/components/SignupPage';
import Login from '../src/components/LoginPage';

const App = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.allChats);
  const projectMessages = useSelector((state) => state.projectMessages);
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Seçilen proje id


  const getProjects = async () =>{
    const response = await fetch("http://localhost:3001/chat/allChat",{
      method:"GET",
      //headers:{Authorization:`Bearer ${token}`}
    })
    const data = await response.json();
    dispatch(setAllChats(data));
    console.log(data);
  }

  useEffect(()=>{
    getProjects();
  },[]) // eslint-disable-line react-hooks/exhaustive-deps


  const selectedProject = projects.find(project => project.chatUrl === selectedProjectId); // Seçilen projeyi bulma

  const [isChatStarted, setIsChatStarted] = useState(false);
  /* const [projects, setProjects] = useState([
    { id: 1, name: 'Konuşma 1', description: 'Burda açıklama kısmı koyabiliriz' },
    { id: 2, name: 'Konuşma 2', description: 'Burda açıklama kısmı koyabiliriz' },
    { id: 3, name: 'Proje', description: 'Burda açıklama kısmı koyabiliriz.' },
    { id: 4, name: 'Araştırma 4', description: 'Burda açıklama kısmı koyabiliriz' },
    { id: 5, name: 'Genel sohbet', description: 'Burda açıklama kısmı koyabiliriz' }
  ]);
   */

  //Ben direk veri bulunsun yapıyı çalıştırırken diye statelerle yazdım Erdem
  //const [projectMessages, setProjectMessages] = useState({}); // Projeler için mesaj tutma nesnesi
  const [newProjectName, setNewProjectName] = useState(''); // Yeni proje
  const [isAddingProject, setIsAddingProject] = useState(false); // Yeni proje eklemenin statei

  const startChat = () => {
    setIsChatStarted(true);
  };

  const selectProject = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const getMessagesForProject = (projectUrl) => {
    const currentProject = projects.find(project => project.chatUrl === projectUrl);
    return currentProject.messages // Seçilen projenin mesajlarını çek
  };

  const handleAddProjectClick = () => {
    setIsAddingProject(true); // Yeni proje ekleme ksımı
  };

  const handleProjectNameChange = (e) => {
    setNewProjectName(e.target.value); // Kullanıcının yazdığı proje ismi
  };

  const handleAddProject = async () => {
    if (newProjectName.trim() !== '') {
      const newProject = {
        chatTitle: newProjectName,
      };
      const newProjectResponse = await fetch("http://localhost:3001/chat/newChat",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          //Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(newProject)
      })
      const newProjectAll = await newProjectResponse.json();
      getProjects();
    }
  };

  const handleCancelAddProject = () => {
    setNewProjectName(''); // Proje adını boşa set etme
    setIsAddingProject(false);
  };

  //proje silme
  
  const handleDeleteProject = async (projectUrl) => {
    const response = await fetch(`http://localhost:3001/chat/deleteChat?chatUrl=${projectUrl}`,{
      method:"DELETE",
      headers:{
        //Authorization:`Bearer ${token}`
      }
    })
    const newProjectAll = await response.json();
    getProjects();
  };

  
  const handleInputBoxClick = async () => {
    await getProjects();
  };

  return (
    <div className="App">
      {!isChatStarted ? (
        <WelcomePage onStartChat={startChat} />
      ) : (
        <>
         
          <div className="projects-list">
            <h2>Projeler</h2>
            <div className="projects-container">
              {projects.map((project) => (
                <div
                  key={project.chatUrl}
                  onClick={() => selectProject(project.chatUrl)}
                  className={`project-card ${selectedProjectId === project.chatUrl ? 'selected' : ''}`}
                >
                  <h3>{project.chatTitle}</h3>
                  <p>{project.description}</p>
                  <button className="delete-button" onClick={(e) => {
                    e.stopPropagation(); 
                    handleDeleteProject(project.chatUrl);
                  }}>
                    Sil
                  </button>
                </div>
              ))}
            </div>

            
            <button onClick={handleAddProjectClick} className="add-project-button">Yeni Proje Ekle</button>

            
            {isAddingProject && (
              <div className="add-project-form">
                <input
                  type="text"
                  placeholder="Yeni sohbet ismini girin."
                  value={newProjectName}
                  onChange={handleProjectNameChange}
                />
                <button onClick={handleAddProject}>Ekle</button>
                <button onClick={handleCancelAddProject}>İptal</button>
              </div>
            )}

{selectedProjectId && (
            <div className="chat-container">
              
              <div className="project-title">
                <h2>{selectedProject.chatTitle}</h2>
              </div>
              <ChatContainer
                messages={getMessagesForProject(selectedProjectId)}  // Seçilen konuşmanın mesajları
                project={selectedProject} 
              />
              <InputBox onSendMessage={selectedProjectId} onClick={handleInputBoxClick}/>
            </div>
          )}
          </div>

         
          
        </>
      )}
    </div>
  );
};

export default App;
