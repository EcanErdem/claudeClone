import React, { useEffect, useState } from 'react';
import WelcomePage from './WelcomePage';
import ChatContainer from './ChatContainer';
import InputBox from './InputBox';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAllChats, setCurrentChatMessages } from "../state";

const MainApp = () => {
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.allChats);
  const projectMessages = useSelector((state) => state.projectMessages);
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Seçilen proje id
  const isAuth = Boolean(useSelector((state) => state.token));

  const [searchTerm, setSearchTerm] = useState(''); // Arama terimi state'i
  const [filteredProjects, setFilteredProjects] = useState(projects); // Filtrelenmiş projeler
  const [newProjectName, setNewProjectName] = useState(''); // Yeni proje adı
  const [isAddingProject, setIsAddingProject] = useState(false); // Yeni proje eklenip eklenmediği durumu
  const [isThinking, setIsThinking] = useState(false);

  const getProjects = async () => {
    const response = await fetch(`http://localhost:3001/chat/allChat?user=${user._id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    dispatch(setAllChats(data));
    setFilteredProjects(data); // Projeleri filtreleme için set et
    console.log(data);
  };

  useEffect(() => {
    if (isAuth) {
      getProjects();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Arama terimi değiştiğinde projeleri filtrele
    setFilteredProjects(
      projects.filter(project =>
        project.chatTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, projects]);

  const selectedProject = projects.find(project => project.chatUrl === selectedProjectId); // Seçilen projeyi bulma

  const [isChatStarted, setIsChatStarted] = useState(false);

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
    setIsAddingProject(!isAddingProject); // Toggle form visibility
    if (isAddingProject) { // If we're closing the form, clear the input
      setNewProjectName('');
    }
  };

  const handleProjectNameChange = (e) => {
    setNewProjectName(e.target.value); // Kullanıcının yazdığı proje ismi
  };

  const handleAddProject = async () => {
    if (newProjectName.trim() !== '') {
      const newProject = {
        chatTitle: newProjectName,
        user: user._id
      };
      const newProjectResponse = await fetch("http://localhost:3001/chat/newChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      });
      const newProjectAll = await newProjectResponse.json();
      getProjects();
    }
  };

  const handleCancelAddProject = () => {
    setNewProjectName(''); // Proje adını boşa set etme
    setIsAddingProject(false);
  };

  const handleDeleteProject = async (projectUrl) => {
    const response = await fetch(`http://localhost:3001/chat/deleteChat?chatUrl=${projectUrl}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const newProjectAll = await response.json();
    getProjects();
  };

  const handleInputBoxClick = async () => {
    setIsThinking(true);
    await getProjects();
    setIsThinking(false);
  };

  return (
    <div className="App">
      {!isChatStarted ? (
        <WelcomePage onStartChat={startChat} />
      ) : (
        <>
          <div className="projects-list">
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
                  <button className="delete-button" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.chatUrl);
                  }}>
                    Sil
                  </button>
                </div>
              ))}
            </div>

            <div className="new-chat-section">
              <button 
                onClick={handleAddProjectClick} 
                className={`add-project-button ${isAddingProject ? 'active' : ''}`}
              >
                <span>Yeni Sohbet Ekle</span>
                <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {isAddingProject && (
                <div className="add-project-form">
                  <input
                    type="text"
                    placeholder="Yeni sohbet ismini girin."
                    value={newProjectName}
                    onChange={handleProjectNameChange}
                  />
                  <div className="form-buttons">
                    <button onClick={handleAddProject}>Ekle</button>
                    <button onClick={handleCancelAddProject}>İptal</button>
                  </div>
                </div>
              )}
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
