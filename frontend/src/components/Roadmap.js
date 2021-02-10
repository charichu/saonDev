import React from "react";
import { withNamespaces } from 'react-i18next';

const Roadmap = ({t}) => (
  <div className="bg-dark text-white text-center hero my-5">
    <p>
      <h2>Roadmap</h2>
      <ul className="list-group-dark list-group-flush text-left">
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check1" />
            <label class="custom-control-label" for="check1">
              Edit and Add Books
            </label>
          </div>          
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check2" />
            <label class="custom-control-label" for="check2">
              RBCA support
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check3" />
            <label class="custom-control-label" for="check3">              
              Full frontend multilangugae support
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check4" />
            <label class="custom-control-label" for="check4">              
              GitHub Deplyoment
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check5" />
            <label class="custom-control-label" for="check5">              
              CI/CD
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check6" />
            <label class="custom-control-label" for="check6">              
              Expanding the database
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check7" />
            <label class="custom-control-label" for="check7">              
              Randomizers: Loot, BasicNPC...
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check8" />
            <label class="custom-control-label" for="check8">              
              Include basic character creation
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check9" />
            <label class="custom-control-label" for="check9">              
              Save and share NPCs, -Collections
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check10" />
            <label class="custom-control-label" for="check10">              
              Character Viewer/Edior
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check11" />
            <label class="custom-control-label" for="check11">              
              Community Managment and Involvment
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check12" />
            <label class="custom-control-label" for="check12">              
              Design Overhaul
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check13" />
            <label class="custom-control-label" for="check13">              
              Skill Checks
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check14" />
            <label class="custom-control-label" for="check14">              
              Battle monitoring
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check15" />
            <label class="custom-control-label" for="check15">              
              Shared Inventory
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check16" />
            <label class="custom-control-label" for="check16">              
              Campaign Managment
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check17" />
            <label class="custom-control-label" for="check17">              
              Shared Notes / Posts
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check18" />
            <label class="custom-control-label" for="check18">              
              Discord Integration
            </label>
          </div> 
        </li>
        <li className="list-group-item list-group-item-dark">
          <div className="custom-control custom-checkbox" >
            <input type="checkbox" class="custom-control-input" id="check19" />
            <label class="custom-control-label" for="check19">              
              Maps and other visual notes
            </label>
          </div> 
        </li>
      </ul>
    </p>
  </div>
);

export default withNamespaces()(Roadmap);
