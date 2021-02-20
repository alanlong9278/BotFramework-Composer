// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { FontSizes } from '@uifabric/fluent-theme';

import { Severity, useDiagnosticsStatistics } from './useDiagnostics';

/**
 * Displays how many errors and warnings in current project.
 */
export const DiagnosticsStatusFilter = ({ filterType, onChangeFilterType }) => {
  const { errorsCount, warningsCount } = useDiagnosticsStatistics();

  return (
    <div
      css={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#F7F7F7',
      }}
      data-testid="diagnostics-tab-header--collapsed"
    >
      <DefaultButton
        iconProps={{ iconName: 'StatusErrorFull' }}
        styles={{
          root: {
            height: '24px',
            padding: 0,
            paddingRight: '3px',
            width: '100%',
            border: 'none',
            backgroundColor: filterType === Severity.Error ? '#edebe9' : '#F7F7F7',
          },
          label: { fontSize: FontSizes.size12, fontFamily: 'Segoe UI', lineHeight: '12px' },
          icon: { color: '#EB3941', fontSize: FontSizes.size14, lineHeight: '18px' },
        }}
        onClick={() => {
          onChangeFilterType(Severity.Error);
        }}
      >
        {errorsCount}
      </DefaultButton>
      <DefaultButton
        iconProps={{ iconName: 'WarningSolid' }}
        styles={{
          root: {
            height: '24px',
            padding: 0,
            paddingRight: '3px',
            border: 'none',
            width: '100%',
            backgroundColor: filterType === Severity.Warning ? '#edebe9' : '#F7F7F7',
          },
          label: { fontSize: FontSizes.size12, fontFamily: 'Segoe UI', lineHeight: '12px' },
          icon: { color: '#F4BD00', fontSize: FontSizes.size14, lineHeight: '18px' },
        }}
        onClick={() => {
          onChangeFilterType(Severity.Warning);
        }}
      >
        {warningsCount}
      </DefaultButton>
    </div>
  );
};
