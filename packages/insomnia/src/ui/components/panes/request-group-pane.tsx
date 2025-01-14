import React, { FC, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { Settings } from '../../../models/settings';
import { useActiveRequestSyncVCSVersion, useGitVCSVersion } from '../../hooks/use-vcs-version';
import { RequestGroupLoaderData } from '../../routes/request-group';
import { WorkspaceLoaderData } from '../../routes/workspace';
import { PanelContainer, TabItem, Tabs } from '../base/tabs';
import { AuthDropdown } from '../dropdowns/auth-dropdown';
import { AuthWrapper } from '../editors/auth/auth-wrapper';
import { ErrorBoundary } from '../error-boundary';
import { MarkdownPreview } from '../markdown-preview';
import { RequestGroupSettingsModal } from '../modals/request-group-settings-modal';

export const RequestGroupPane: FC<{ settings: Settings }> = ({ }) => {
  const { activeRequestGroup } = useRouteLoaderData('request-group/:requestGroupId') as RequestGroupLoaderData;
  const { activeEnvironment } = useRouteLoaderData(':workspaceId') as WorkspaceLoaderData;
  const [isRequestGroupSettingsModalOpen, setIsRequestGroupSettingsModalOpen] = useState(false);
  const gitVersion = useGitVCSVersion();
  const activeRequestSyncVersion = useActiveRequestSyncVCSVersion();
  const uniqueKey = `${activeEnvironment?.modified}::${activeRequestGroup._id}::${gitVersion}::${activeRequestSyncVersion}`;
  return (
    <>
      <Tabs aria-label="Request group pane tabs">
        <TabItem key="auth" title={<AuthDropdown authentication={activeRequestGroup.authentication} />}>
          <ErrorBoundary
            key={uniqueKey}
            errorClassName="font-error pad text-center"
          >
            <div />
            <AuthWrapper authentication={activeRequestGroup.authentication} />
          </ErrorBoundary>
        </TabItem>
        <TabItem
          key="docs"
          title={
            <>
              Docs
              {activeRequestGroup.description && (
                <span className="ml-2 p-2 border-solid border border-[--hl-md] rounded-lg">
                  <span className="flex w-2 h-2 bg-green-500 rounded-full" />
                </span>
              )}
            </>
          }
        >
          <PanelContainer className="tall">
            {activeRequestGroup.description ? (
              <div>
                <div className="pull-right pad bg-default">
                  <button
                    className="btn btn--clicky"
                    onClick={() => setIsRequestGroupSettingsModalOpen(true)}
                  >
                    Edit
                  </button>
                </div>
                <div className="pad">
                  <ErrorBoundary errorClassName="font-error pad text-center">
                    <MarkdownPreview
                      heading={activeRequestGroup.name}
                      markdown={activeRequestGroup.description}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden editor vertically-center text-center">
                <p className="pad text-sm text-center">
                  <span className="super-faint">
                    <i
                      className="fa fa-file-text-o"
                      style={{
                        fontSize: '8rem',
                        opacity: 0.3,
                      }}
                    />
                  </span>
                  <br />
                  <br />
                  <button
                    className="btn btn--clicky faint"
                    onClick={() => setIsRequestGroupSettingsModalOpen(true)}
                  >
                    Add Description
                  </button>
                </p>
              </div>
            )}
          </PanelContainer>
        </TabItem>
      </Tabs>
      {isRequestGroupSettingsModalOpen && (
        <RequestGroupSettingsModal
          requestGroup={activeRequestGroup}
          onHide={() => setIsRequestGroupSettingsModalOpen(false)}
        />
      )}</>
  );
};
