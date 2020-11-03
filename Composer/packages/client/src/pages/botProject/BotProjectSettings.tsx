// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useRecoilValue } from 'recoil';
import React, { useMemo, useState, Suspense } from 'react';
import formatMessage from 'format-message';
import { RouteComponentProps } from '@reach/router';
import { JsonEditor } from '@bfc/code-editor';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { DialogSetting } from '@bfc/shared';
import { FontSizes, FontWeights } from 'office-ui-fabric-react/lib/Styling';
import { NeutralColors } from '@uifabric/fluent-theme';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import { INavTreeItem } from '../../components/NavTree';
import { Page } from '../../components/Page';
import { dispatcherState } from '../../recoilModel';
import { settingsState, userSettingsState, schemasState } from '../../recoilModel/atoms';
import { botProjectSpaceSelector, rootBotProjectIdSelector } from '../../recoilModel/selectors/project';
import { navigateTo } from '../../utils/navigation';

import BotProjectSettingsTableView from './BotProjectSettingsTableView';

// -------------------- Styles -------------------- //

const header = css`
  padding: 5px 20px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: space-between;
  label: PageHeader;
`;

const container = css`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  height: 100%;
`;

const botNameStyle = css`
  font-size: ${FontSizes.xLarge};
  font-weight: ${FontWeights.semibold};
  color: ${NeutralColors.black};
`;

const mainContentHeader = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

// -------------------- BotProjectSettings -------------------- //

const BotProjectSettings: React.FC<RouteComponentProps<{ projectId: string; skillId: string }>> = (props) => {
  const botProjectsMetaData = useRecoilValue(botProjectSpaceSelector);
  const rootBotProjectId = useRecoilValue(rootBotProjectIdSelector);
  const userSettings = useRecoilValue(userSettingsState);
  const projectId = (props['*'] === 'root' ? rootBotProjectId : props['*']) || '';
  const schemas = useRecoilValue(schemasState(projectId));
  const botProject = botProjectsMetaData.find((b) => b.projectId === projectId);

  const isRootBot = !!botProject?.isRootBot;
  const botName = botProject?.name;
  const settings = useRecoilValue(settingsState(projectId));

  const [isAdvancedSettingsEnabled, setAdvancedSettingsEnabled] = useState<boolean>(false);

  const { setSettings } = useRecoilValue(dispatcherState);

  const navLinks: INavTreeItem[] = useMemo(() => {
    const localBotProjects = botProjectsMetaData.filter((b) => !b.isRemote);
    const newbotProjectLinks: INavTreeItem[] = localBotProjects.map((b) => {
      return {
        id: b.projectId,
        name: b.name,
        ariaLabel: formatMessage('bot'),
        url: b.isRootBot
          ? `/bot/${rootBotProjectId}/botProjectsSettings/root`
          : `/bot/${rootBotProjectId}/botProjectsSettings/${b.projectId}`,
        isRootBot: b.isRootBot,
      };
    });
    const rootBotIndex = localBotProjects.findIndex((link) => link.isRootBot);

    if (rootBotIndex > -1) {
      const rootBotLink = newbotProjectLinks.splice(rootBotIndex, 1)[0];
      newbotProjectLinks.splice(0, 0, rootBotLink);
    }
    return newbotProjectLinks;
  }, [botProjectsMetaData]);

  const onRenderHeaderContent = () => {
    return formatMessage(
      'This Page contains detailed information about your bot. For security reasons, they are hidden by default. To test your bot or publish to Azure, you may need to provide these settings'
    );
  };

  const saveChangeResult = (result: DialogSetting) => {
    try {
      setSettings(projectId, result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message);
    }
  };

  const handleChange = (result: any) => {
    // prevent result was undefined, it will cause error
    if (result && typeof result === 'object') {
      saveChangeResult(result);
    }
  };

  if (!botProject) {
    navigateTo(`/bot/${rootBotProjectId}/botProjectsSettings/root`);
    return null;
  }

  return (
    <Page
      data-testid="BotProjectsSettings"
      headerStyle={header}
      mainRegionName={formatMessage('Bot projects settings list View')}
      navLinks={navLinks}
      navRegionName={formatMessage('Bot Projects Settings Navigation Pane')}
      shouldShowEditorError={false}
      title={formatMessage('Bot management and configurations')}
      toolbarItems={[]}
      onRenderHeaderContent={onRenderHeaderContent}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <div css={container}>
          <div css={mainContentHeader}>
            <div css={botNameStyle}>
              {`${botName} (${isRootBot ? formatMessage('Root Bot') : formatMessage('Skill')})`}
            </div>
            <Toggle
              inlineLabel
              checked={isAdvancedSettingsEnabled}
              className={'advancedSettingsView'}
              defaultChecked={false}
              label={formatMessage('Advanced Settings View (json)')}
              onChange={() => setAdvancedSettingsEnabled(!isAdvancedSettingsEnabled)}
            />
          </div>
          {isAdvancedSettingsEnabled ? (
            <JsonEditor
              key={'settingsjson'}
              editorSettings={userSettings.codeEditor}
              id={projectId}
              schema={schemas.sdk.content}
              value={settings}
              onChange={handleChange}
            />
          ) : (
            <BotProjectSettingsTableView hasSkills={botProjectsMetaData.length > 1} projectId={projectId} />
          )}
        </div>
      </Suspense>
    </Page>
  );
};

export default BotProjectSettings;
