import React from "react";
import { withNamespaces } from 'react-i18next';

const Roadmap = ({t}) => (
  <div className="bg-dark text-white text-center hero my-5">
    <p>
      <h2>Roadmap</h2>
      <ul class="list-group-dark list-group-flush">
        <li class="list-group-item list-group-item-dark">Edit and Add Books</li>
        <li class="list-group-item list-group-item-dark">RBCA support</li>
        <li class="list-group-item list-group-item-dark">Full multilangugae support in the frontend</li>
        <li class="list-group-item list-group-item-dark">Jest Test Suites</li>
        <li class="list-group-item list-group-item-dark">GitHub Deplyoment</li>
        <li class="list-group-item list-group-item-dark">CI/CD</li>
        <li class="list-group-item list-group-item-dark">Expanding the database: Advantages, Special Abilities, Skills, Recipes, ...</li>
        <li class="list-group-item list-group-item-dark">Include basic character creation without validations(!), also for NPCs then</li>
        <li class="list-group-item list-group-item-dark">Character Viewer/Edior</li>
        <li class="list-group-item list-group-item-dark">Intensive Community Managment and Involvment</li>
        <li class="list-group-item list-group-item-dark">Design Overhaul</li>
        <li class="list-group-item list-group-item-dark">Skill Checks</li>
        <li class="list-group-item list-group-item-dark">Battle monitoring</li>
        <li class="list-group-item list-group-item-dark">Shared Inventory</li>
        <li class="list-group-item list-group-item-dark">Campaign Managment</li>
        <li class="list-group-item list-group-item-dark">Shared Notes / Posts</li>
        <li class="list-group-item list-group-item-dark">Discord Integration</li>
        <li class="list-group-item list-group-item-dark">Maps and other visual notes</li>
      </ul>
    </p>
  </div>
);

export default withNamespaces()(Roadmap);
