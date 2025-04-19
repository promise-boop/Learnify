import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #5e72e4;
  text-decoration: none;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #5e72e4;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #32325d;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  width: 200px;
  z-index: 10;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #525f7f;
  text-decoration: none;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  color: #f5365c;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const Header = () => {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    closeDropdown();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <HeaderContainer>
      <Logo to="/dashboard">Learnify</Logo>
      
      {user && (
        <UserSection>
          <UserProfile onClick={toggleDropdown}>
            <Avatar>{getInitials(user.user_metadata?.full_name || user.email)}</Avatar>
            <UserName>{user.user_metadata?.full_name || user.email}</UserName>
            
            <DropdownMenu isOpen={dropdownOpen}>
              <MenuItem to="/profile" onClick={closeDropdown}>Profile</MenuItem>
              <MenuItem to="/settings" onClick={closeDropdown}>Settings</MenuItem>
              <MenuItem to="/credits" onClick={closeDropdown}>Credits</MenuItem>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </DropdownMenu>
          </UserProfile>
        </UserSection>
      )}
    </HeaderContainer>
  );
};

export default Header;