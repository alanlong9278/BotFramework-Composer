// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { useSetRecoilState } from 'recoil';
import { FontSizes } from '@uifabric/fluent-theme';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';

import { debugPanelExpansionState } from '../../../../../recoilModel';

import { useDiagnosticsStatistics } from './useDiagnostics';

/**
 * Displays how many errors and warnings in current project.
 */
export const DiagnosticsStatus = () => {
  const setExpansion = useSetRecoilState(debugPanelExpansionState);
  const { errorsCount, warningsCount } = useDiagnosticsStatistics();

  return (
    <div
      css={{ height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}
      data-testid="diagnostics-tab-header--collapsed"
    >
      <DefaultButton
        styles={{
          root: {
            height: '36px',
            padding: '0 5px',
            minWidth: '20px',
            border: 'none',
            marginRight: '8px',
          },
          label: { fontSize: FontSizes.size18, fontFamily: 'Segoe UI', lineHeight: '20px' },
        }}
        onClick={() => {
          setExpansion(true);
        }}
      >
        <span css={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
          <FontIcon
            css={{ color: '#EB3941', fontSize: FontSizes.size18, lineHeight: '18px', marginRight: '5px' }}
            iconName="StatusErrorFull"
          />
          {errorsCount}
        </span>
        <span css={{ display: 'flex', alignItems: 'center' }}>
          <FontIcon
            css={{ color: '#F4BD00', fontSize: FontSizes.size18, lineHeight: '18px', marginRight: '5px' }}
            iconName="WarningSolid"
          />
          {warningsCount}
        </span>
      </DefaultButton>
    </div>
  );
};
