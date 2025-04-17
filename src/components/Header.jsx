import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLeftRight, faUpDown } from '@fortawesome/free-solid-svg-icons';
import "../сss/Header.css"

const Header = () => {
    return (
      <header className="header">
        <nav>
          <ul className="nav-list">
            <li>
              <NavLink to="/"><FontAwesomeIcon icon={ faHouse } className="pr-[5px]" /> Home</NavLink>
            </li>
            <li>
              <NavLink to="/vertical" activeclassname="active"><FontAwesomeIcon icon={ faUpDown } className="pr-[5px]" /> Vertical traffic lights</NavLink>
            </li>
            <li>
              <NavLink to="/horizontal" activeclassname="active"><FontAwesomeIcon icon={ faLeftRight } className="pr-[5px]" /> Horizontal traffic lights</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    );
};

export default Header;