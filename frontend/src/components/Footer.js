import React from "react";
import { withNamespaces } from 'react-i18next';
//eslint-disable-next-line
import i18n from '../i18n';

const Footer = ({t}) => {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }
  return(
  <footer className="bg-dark p-3 text-center text-light">
  <div>
    <button onClick={() => changeLanguage('de')}>de</button>
    <button onClick={() => changeLanguage('en')}>en</button>
  </div>
    <p>
      For questions and problems contact: <a href="mailto:david.vennemeier@gmail.com">david.vennemeier@gmail.com</a>
    </p>
    <p>
      Using <a href="https://auth0.com">Auth0</a>
    </p>
  </footer>
  );
};

export default withNamespaces()(Footer);
