import { memo, useCallback, useState } from "react";
import AppsLoader from "components/system/Apps/AppsLoader";
import Desktop from "components/system/Desktop";
import BootScreen from "components/system/Login/BootScreen";
import LoginScreen from "components/system/Login/LoginScreen";
import Taskbar from "components/system/Taskbar";
import useGlobalErrorHandler from "hooks/useGlobalErrorHandler";
import useGlobalKeyboardShortcuts from "hooks/useGlobalKeyboardShortcuts";
import useIFrameFocuser from "hooks/useIFrameFocuser";
import useUrlLoader from "hooks/useUrlLoader";

type SessionStage = "boot" | "login" | "desktop";

const Index = (): React.ReactElement => {
  const [stage, setStage] = useState<SessionStage>("boot");

  useIFrameFocuser();
  useUrlLoader();
  useGlobalKeyboardShortcuts();
  useGlobalErrorHandler();

  const onBootComplete = useCallback(() => setStage("login"), []);
  const onLogin = useCallback(() => setStage("desktop"), []);

  if (stage === "boot") return <BootScreen onComplete={onBootComplete} />;
  if (stage === "login") return <LoginScreen onLogin={onLogin} />;

  return (
    <Desktop>
      <Taskbar />
      <AppsLoader />
    </Desktop>
  );
};

export default memo(Index);
