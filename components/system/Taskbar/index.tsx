import { memo, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import {
  importAIButton,
  importAIChat,
  importCalendar,
  importSearch,
  importStartMenu,
} from "components/system/Taskbar/functions";
import SearchButton from "components/system/Taskbar/Search/SearchButton";
import StartButton from "components/system/Taskbar/StartButton";
import Clock from "components/system/Taskbar/Clock";
import StyledTaskbar from "components/system/Taskbar/StyledTaskbar";
import TaskbarEntries from "components/system/Taskbar/TaskbarEntries";
import WelcomePanel from "components/system/Taskbar/WelcomePanel";
import XPTray from "components/system/Taskbar/XPTray";
import useTaskbarContextMenu from "components/system/Taskbar/useTaskbarContextMenu";
import { FOCUSABLE_ELEMENT } from "utils/constants";
import { useProcesses } from "contexts/process";

const AIButton = dynamic(importAIButton);
const AIChat = dynamic(importAIChat);
const Calendar = dynamic(importCalendar);
const Search = dynamic(importSearch);
const StartMenu = dynamic(importStartMenu);
const XP_TRAY_WIDTH = 92;

const Taskbar: FC = () => {
  const [clockWidth, setClockWidth] = useState(0);
  const [startMenuVisible, setStartMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [aiVisible, setAIVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showWelcomePanel, setShowWelcomePanel] = useState(true);
  const [isCrtEnabled, setIsCrtEnabled] = useState(false);
  const { open } = useProcesses();

  const toggleStartMenu = useCallback(
    (showMenu?: boolean): void =>
      setStartMenuVisible((currentMenuState) => showMenu ?? !currentMenuState),
    []
  );

  const toggleSearch = useCallback(
    (showSearch?: boolean): void =>
      setSearchVisible(
        (currentSearchState) => showSearch ?? !currentSearchState
      ),
    []
  );

  const toggleAI = useCallback(
    (showAI?: boolean): void =>
      setAIVisible((currentAIState) => showAI ?? !currentAIState),
    []
  );
  const toggleCalendar = useCallback(
    (showCalendar?: boolean): void =>
      setCalendarVisible(
        (currentCalendarState) => showCalendar ?? !currentCalendarState
      ),
    []
  );

  const hasAI = false;

  const onToggleWelcome = useCallback(() => {
    setShowWelcomePanel(true);
  }, []);

  const onToggleCrt = useCallback(() => {
    setIsCrtEnabled((currentValue) => {
      const nextValue = !currentValue;

      document.body.style.filter = nextValue
        ? "brightness(1.08) contrast(1.04)"
        : "";

      return nextValue;
    });
  }, []);

  return (
    <>
      <AnimatePresence initial={false} presenceAffectsLayout={false}>
        {startMenuVisible && (
          <StartMenu key="startMenu" toggleStartMenu={toggleStartMenu} />
        )}
        {searchVisible && <Search key="search" toggleSearch={toggleSearch} />}
      </AnimatePresence>
      <StyledTaskbar {...useTaskbarContextMenu()} {...FOCUSABLE_ELEMENT}>
        <StartButton
          startMenuVisible={startMenuVisible}
          toggleStartMenu={toggleStartMenu}
        />
        <SearchButton searchVisible={searchVisible} toggleSearch={toggleSearch} />
        <TaskbarEntries
          clockWidth={clockWidth}
          hasAI={hasAI}
          trayWidth={XP_TRAY_WIDTH}
        />
        <Clock
          hasAI={hasAI}
          setClockWidth={setClockWidth}
          toggleCalendar={toggleCalendar}
          trayWidth={0}
          width={clockWidth}
        />
        <XPTray
          clockWidth={clockWidth}
          hasAI={hasAI}
          isCrtEnabled={isCrtEnabled}
          onToggleCrt={onToggleCrt}
          onToggleWelcome={onToggleWelcome}
          trayWidth={XP_TRAY_WIDTH}
        />
        {hasAI && <AIButton aiVisible={aiVisible} toggleAI={toggleAI} />}
        <WelcomePanel
          onClose={() => setShowWelcomePanel(false)}
          onOpenAbout={() => {
            open("AboutMe", {});
            setShowWelcomePanel(false);
          }}
          onOpenProjects={() => {
            open("MyProjects", {});
            setShowWelcomePanel(false);
          }}
          visible={showWelcomePanel}
        />
      </StyledTaskbar>
      <AnimatePresence initial={false} presenceAffectsLayout={false}>
        {calendarVisible && (
          <Calendar key="calendar" toggleCalendar={toggleCalendar} />
        )}
        {aiVisible && <AIChat key="aiChat" toggleAI={toggleAI} />}
      </AnimatePresence>
    </>
  );
};

export default memo(Taskbar);
