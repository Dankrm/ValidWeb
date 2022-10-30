import React, { ChangeEvent, useState } from 'react';
import { vscodeAPI } from '../../lib/VSCodeApi';

type Rules = {
  id: number,
  ruleTypeId: number,
  chainingTypeId: number,
  description: string,
  basedElement: string,
  validationElement: string,
  visible: boolean
};

export default function RuleTypes() {
  const [rules, setRules] = useState<Rules[]>([]);

  vscodeAPI.postMessage(
    {
      type: 'loadRules',
    }
  );  

  vscodeAPI.onMessage((message) => {
    switch (message.data.type) {
      case 'loadedRules': {
        const tmpRules: Rules[] = [];
        message.data.rules.forEach((rules: Rules) => {
          tmpRules.push(rules);
        });
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
      { rules && rules.map((ruleType, index) => {
        return (
          <div>
            <label htmlFor="" key={ruleType.id}>
              <input defaultChecked={ruleType.visible} type="checkbox" value={ruleType.id} onChange={onChangeRule} />
              {ruleType.basedElement} e {ruleType.validationElement}
            </label>
          </div>
        );
      })}
    </>
  );
}