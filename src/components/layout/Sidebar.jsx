import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px 0;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    z-index: 1000;
  }
`;

const Logo = styled.div`
  padding: 0 20px;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #5e72e4;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled(NavLink)`
  padding: 12px 20px;
  color: #525f7f;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(94, 114, 228, 0.1);
    color: #5e72e4;
  }
  
  &.active {
    background-color: rgba(94, 114, 228, 0.1);
    color: #5e72e4;
    border-left: 3px solid #5e72e4;
  }
`;

const NavSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  padding: 10px 20px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  color: #8898aa;
`;

const UserSection = styled.div`
  padding: 20px;
  margin-top: auto;
  border-top: 1px solid #e9ecef;
`;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <SidebarContainer isOpen={isOpen}>
      <Logo>Learnify</Logo>
      
      <NavMenu>
        <NavSection>
          <NavItem to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </NavItem>
          <NavItem to="/subjects" className={location.pathname.includes('/subjects') ? 'active' : ''}>
            My Subjects
          </NavItem>
          <NavItem to="/progress" className={location.pathname === '/progress' ? 'active' : ''}>
            Progress
          </NavItem>
          <NavItem to="/credits" className={location.pathname === '/credits' ? 'active' : ''}>
            Credits
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle>More</SectionTitle>
          <NavItem to="/coming-soon" className={location.pathname === '/coming-soon' ? 'active' : ''}>
            Coming Soon
          </NavItem>
          <NavItem to="/terms" className={location.pathname === '/terms' ? 'active' : ''}>
            Terms & Conditions
          </NavItem>
          <NavItem to="/support" className={location.pathname === '/support' ? 'active' : ''}>
            Need Support
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle>AI Assistant</SectionTitle>
          <NavItem to="/chatbot" className={location.pathname === '/chatbot' ? 'active' : ''}>
            Chat with Ramsey
          </NavItem>
        </NavSection>
      </NavMenu>
      
      <UserSection>
        {user ? (
          <>
            <div>{user.profile?.full_name || user.email}</div>
            <button onClick={logout}>Sign Out</button>
          </>
        ) : (
          <NavItem to="/login">Sign In</NavItem>
        )}
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar;