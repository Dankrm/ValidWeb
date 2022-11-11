import React, { ChangeEvent, useState } from 'react';
import { vscodeAPI } from '../../lib/VSCodeApi';

vscodeAPI.postMessage(
  {
    type: 'loadRules',
  }
);  

export default function Rules() {
  const [rules, setRules] = useState<Rules[]>([]);
  vscodeAPI.onMessage((message) => {
    switch (message.data.type) {
      case 'loadedRules': {
        const tmpRules: Rules[] = [];
        for (let rule of message.data.rules) {
          tmpRules.push(rule);
        }
        setRules(tmpRules);
        break;
      }
    }
  });

  const onChangeRule = (event: ChangeEvent<HTMLInputElement>) => {
    vscodeAPI.postMessage(
      {
        type: 'changeVisibilityRules',
        id: event.target.value,
        visible: event.target.checked
      }
    );
  };

  return (
    <>
      <div className="btn-controls">
        
      </div>
      { rules && rules.map((rule, index) => {
        return (
          <div className="checkbox-item" key={rule.id}>
            <label>
              <input defaultChecked={rule.visible} type="checkbox" value={rule.id} onChange={onChangeRule} />
              {rule.description}
            </label>
          </div>
        );
      })}
    </>
  );
}