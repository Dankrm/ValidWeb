import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vscodeAPI } from '../../lib/VSCodeApi';

type RuleType = {
  id: number,
  code: string,
  type: string,
  diagnostic: number,
  visible: boolean
};

vscodeAPI.postMessage(
  {
    type: 'loadRuleTypes',
  }
);

export default function Main() {
  const [ruleTypes, setRuleTypes] = useState<RuleType[]>([]);

  vscodeAPI.onMessage((message) => {
    switch (message.data.type) {
      case 'loadedRuleTypes': {
        const tmpRuleTypes: RuleType[] = [];
        message.data.ruleTypes.forEach((ruleType: RuleType) => {
          tmpRuleTypes.push(ruleType);
        });
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
      <div className="btn-controls">
        
      </div>
      { ruleTypes && ruleTypes.map((ruleType, index) => {
        return (
          <div>
            <label htmlFor="" key={ruleType.id}>
              <input defaultChecked={ruleType.visible} type="checkbox" value={ruleType.id} onChange={onChangeRuleType} />
              {ruleType.type}
            </label>
          </div>
        );
      })}
    </>
  );
}