import React, { ChangeEvent, useState } from 'react';
import { vscodeAPI } from '../../lib/VSCodeApi';

vscodeAPI.postMessage(
  {
    type: 'loadRuleTypes',
  }
);  

export default function RuleTypes () {
  const [ruleTypes, setRuleTypes] = useState<RuleType[]>([]);

  vscodeAPI.onMessage((message) => {
    switch (message.data.type) {
      case 'loadedRuleTypes': {
        const tmpRuleTypes: RuleType[] = [];
        for (let ruleType of message.data.ruleTypes) {
          tmpRuleTypes.push(ruleType);
        }
        setRuleTypes(tmpRuleTypes);
        break;
      }
    }
  });

  const onChangeRuleType = (event: ChangeEvent<HTMLInputElement>) => {
    vscodeAPI.postMessage(
      {
        type: 'changeVisibilityRuleTypes',
        id: event.target.value,
        visible: event.target.checked
      }
    );
  };

  return (
    <>
      { ruleTypes && ruleTypes.map((ruleType, index) => {
        return (
          <div className="checkbox-item" key={ruleType.id}>
            <label key={ruleType.id}>
              <input defaultChecked={ruleType.visible} type="checkbox" value={ruleType.id} onChange={onChangeRuleType} />
              {ruleType.type}
            </label>
          </div>
        );
      })}
    </>
  );
}