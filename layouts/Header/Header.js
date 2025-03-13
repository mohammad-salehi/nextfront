import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaSearch, FaUsers, FaBars } from "react-icons/fa";
import PersonIcon from '@mui/icons-material/Person';
import Cookies from 'js-cookie'

// icons
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Person2Icon from '@mui/icons-material/Person2';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(to right, #1a237e, #311b92)",
}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.5rem 1rem",
});

const LogoSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

const NavSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

const SearchBox = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4fc3f7",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const StyledButton = styled(Button)({
  color: "#fff",
  background: "rgba(255, 255, 255, 0.1)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
  },
});

const Logout = () => {
  Cookies.remove('access')
  Cookies.remove('refresh')
  window.location.assign('/')
}

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [ProfileBox, setProfileBox] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [Name, setName] = useState(true);
  const [RollName, setRollName] = useState(true);

  const gameCategories = [
    { title: "سامانه بهمن", icon: "🎮" },
  ];

  const handleCategoryClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileBoxClick = (event) => {
    setProfileBox(event.currentTarget);
  };

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };
  const handleProfileBoxClose = () => {
    setMobileMenuAnchor(null);
    setProfileBox(null)

  };

  useEffect(() => {
    setName(`${Cookies.get('name')} ${Cookies.get('lastname')}`)
    setRollName(`${Cookies.get('roll_name')}`)
  }, [])

  return (
    <StyledAppBar position="static" style={{ background: '#01153a' }}>
      <StyledToolbar>
        <LogoSection>

          <img src="/images/bahman_logo.png" style={{ width: '60px' }} />

          <Typography variant="h6" component="div" sx={{ display: { xs: "none", sm: "block" } }}>
            بهمن
          </Typography>
        </LogoSection>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMobileMenuClick}>
              <FaBars />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleClose}
            >
              {gameCategories.map((category) => (
                <MenuItem key={category.title} onClick={handleClose}>
                  {category.icon} {category.title}
                </MenuItem>
              ))}
              <MenuItem onClick={() => { handleProfileBoxClose(), Logout() }} style={{ color: 'rgb(80,80,80)' }}>
                <LogoutIcon style={{ marginLeft: '4px' }} />
                خروج از حساب کاربری
              </MenuItem>
            </Menu>
          </>
        ) : (
          <NavSection>


            <SearchBox
              size="small"
              variant="outlined"
              placeholder="جست‌وجو"
              InputProps={{
                startAdornment: <FaSearch style={{ marginRight: '12px' }} />,
              }}
            />

            <StyledButton
              style={{ background: 'none' }}
              aria-controls="category-menu2"
              aria-haspopup="true"
              onClick={handleProfileBoxClick}
            >
              <PersonIcon style={{ fontSize: '32px', marginLeft: '-16px' }} />
            </StyledButton>
            <Menu
              id="category-menu2"
              anchorEl={ProfileBox}
              open={Boolean(ProfileBox)}
              onClose={handleProfileBoxClose}
            >
              <div style={{display:'inline-block'}}>
                <AccountCircleIcon style={{fontSize:'60px',color: 'rgb(80,80,80)', marginTop:'-40px', marginBottom:'-16px'}} />
              </div>
              <div style={{display:'inline-block'}}>
                <p style={{ marginBottom: '-2px' }} className="pe-3 ps-5">
                  {Name}
                </p>
                <small style={{ marginTop: '-8px', color: 'gray' }} className="pe-3">{RollName}</small>
              </div>
              <hr />

              {/* <MenuItem onClick={handleProfileBoxClose} style={{ color: 'rgb(80,80,80)' }}>
                <AdminPanelSettingsIcon style={{ marginLeft: '4px' }} />
                پنل ادمین
              </MenuItem>
              <MenuItem onClick={handleProfileBoxClose} style={{ color: 'rgb(80,80,80)' }}>
                <Person2Icon style={{ marginLeft: '4px' }} />
                مشاهده پروفایل
              </MenuItem>
              <MenuItem onClick={handleProfileBoxClose} style={{ color: 'rgb(80,80,80)' }}>
                <LockIcon style={{ marginLeft: '4px' }} />
                تغییر رمز عبور
              </MenuItem> */}
              <MenuItem onClick={() => { handleProfileBoxClose(), Logout() }} style={{ color: 'rgb(80,80,80)' }}>
                <LogoutIcon style={{ marginLeft: '4px' }} />
                خروج از حساب کاربری
              </MenuItem>
            </Menu>

          </NavSection>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;