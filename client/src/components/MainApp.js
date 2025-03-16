import React, { useEffect, useState } from 'react';
import WelcomePage from './WelcomePage';
import ChatContainer from './ChatContainer';
import InputBox from './InputBox';
import '../App.css';
import '../styles/chat.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAllChats, setCurrentChatMessages } from "../state";

const MainApp = () => {
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.allChats);
  const projectMessages = useSelector((state) => state.projectMessages);
  const [selectedProjectId, setSelectedProjectId] = useState(null); 
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar durumu
  const isAuth = Boolean(useSelector((state) => state.token));

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [newProjectName, setNewProjectName] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const getProjects = async () => {
    const response = await fetch(`http://localhost:3001/chat/allChat?user=${user._id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    dispatch(setAllChats(data));
    setFilteredProjects(data);
  };

  useEffect(() => {
    if (isAuth) {
      getProjects();
    }
  }, []);

  useEffect(() => {
    setFilteredProjects(
      projects.filter(project =>
        project.chatTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, projects]);

  const selectedProject = projects.find(project => project.chatUrl === selectedProjectId);

  const [isChatStarted, setIsChatStarted] = useState(false);

  const startChat = () => {
    setIsChatStarted(true);
  };

  const selectProject = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const getMessagesForProject = (projectUrl) => {
    const currentProject = projects.find(project => project.chatUrl === projectUrl);
    return currentProject.messages.map(messages => ({
      role: messages.role,
      content: messages.content.map(item=>{
        const {text} = item;
        return text;
      }),
      image: messages.content.map(item=>{
        if(item.type !== "image") return null;
        const img = `data:${item.source.media_type};base64,${item.source.data}`;
        return img;
      })
    }));
  };

  const handleAddProjectClick = () => {
    setIsAddingProject(!isAddingProject);
    if (isAddingProject) {
      setNewProjectName('');
    }
  };

  const handleProjectNameChange = (e) => {
    setNewProjectName(e.target.value);
  };

  const handleAddProject = async () => {
    const newProject = { user: user._id };
    const newProjectResponse = await fetch("http://localhost:3001/chat/newChat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newProject)
    });
    const newProjectAll = await newProjectResponse.json();
    await getProjects();
    selectProject(newProjectAll.chatUrl);
  };

  const handleCancelAddProject = () => {
    setNewProjectName('');
    setIsAddingProject(false);
  };

  const handleDeleteProject = async (projectUrl) => {
    if(selectedProjectId === projectUrl){
      selectProject(null);
    }
    
    const response = await fetch(`http://localhost:3001/chat/deleteChat?chatUrl=${projectUrl}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const newProjectAll = await response.json();
    getProjects();
  };

  const handleInputBoxClick = async () => {
    setIsThinking(true);
    await getProjects();
    setIsThinking(false);
  };

  // Fare sol kenara geldiğinde sidebar'ı açma
  const handleMouseMove = (e) => {
    if (e.clientX < 50 && !sidebarOpen) {
      setSidebarOpen(true);  // Sidebar'ı aç
    } else if (e.clientX > 200 && sidebarOpen) {
      setSidebarOpen(false);  // Sidebar'ı kapat
    }
  };

  // Mouse hareketlerini dinle
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sidebarOpen]);

  return (
    <div className="App">
      {!isChatStarted ? (
        <WelcomePage onStartChat={startChat} />
      ) : (
        <>
          <div className={`projects-list ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Sohbet Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="projects-container">
              {filteredProjects.map((project) => (
                <div
                  key={project.chatUrl}
                  onClick={() => selectProject(project.chatUrl)}
                  className={`project-card ${selectedProjectId === project.chatUrl ? 'selected' : ''}`}
                >
                  <h3>{project.chatTitle}</h3>
                  <button 
                    className="delete-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.chatUrl);
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="new-chat-section">
              <button onClick={()=> handleAddProject()} className={`add-project-button`}>
                <span>Yeni Sohbet Ekle</span>
                <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {selectedProjectId ? (
            <div className="chat-container">
              <div className="project-title">
                <h2>{selectedProject.chatTitle}</h2>
              </div>
              <ChatContainer
                messages={getMessagesForProject(selectedProjectId)}
                projectName={selectedProject.chatTitle}
                isThinking={isThinking}
              />
              <InputBox 
                onSendMessage={selectedProjectId} 
                onClick={handleInputBoxClick}
                setIsThinking={setIsThinking}
              />
            </div>
          ) : (
            <div className="chat-container">
              <div className="empty-chat">
                <h2>Sohbet başlatmak için sol menüden bir sohbet seçin veya yeni bir sohbet oluşturun.</h2>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MainApp;
