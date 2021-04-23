import React from "react";
import { withNamespaces } from 'react-i18next';
import logo from "../assets/logo2.gif";

const Hero = ({t}) => (
  <div className="bg-dark text-white text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">saon 2</h1>

    <p>
    <h2>{t('TranslationTest')}</h2>
    </p>

    <p className="lead">
      {t('text.welcome')}
      <br/>      
      {t('text.welcome.tech')}
      <br/>
      <br/>{t('text.welcome.moreInformation')}
      <a href="https://charichu.github.io/saonDev/"> Roadmap</a>
    </p>
  </div>
);

export default withNamespaces()(Hero);
