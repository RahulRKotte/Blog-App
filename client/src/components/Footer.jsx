import React from 'react'
import Logo from '../images/logo.png'
import Github from '../images/github-mark.png'

const Footer = () => {

  function handleClick(){
    window.open('https://github.com/RahulRKotte', '_blank');
  };

  return (
    <footer>
      <img src={Logo} alt='logo' />
      <div className='spandiv'>
          <span>Made With React By Rahul Kotte</span>
          <div className='github' onClick={handleClick}>
            <img src={Github} alt="github logo"></img>
            <span>RahulRKotte</span>
          </div>
        </div>
    </footer>
  )
}

export default Footer