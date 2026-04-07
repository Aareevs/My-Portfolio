import { basename, extname } from "path";
import { useTheme } from "styled-components";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { m as motion } from "motion/react";
import dynamic from "next/dynamic";
import { Search as SearchIcon } from "components/apps/FileExplorer/NavigationIcons";
import {
  getCachedShortcut,
  getProcessByFileExtension,
  getShortcutInfo,
  isExistingFile,
} from "components/system/Files/FileEntry/functions";
import {
  Documents,
  Pictures,
  Videos,
} from "components/system/StartMenu/Sidebar/SidebarIcons";
import StyledFiles from "components/system/Taskbar/Search/StyledFiles";
import StyledResults from "components/system/Taskbar/Search/StyledResults";
import StyledSearch from "components/system/Taskbar/Search/StyledSearch";
import StyledSections from "components/system/Taskbar/Search/StyledSections";
import StyledSuggestions from "components/system/Taskbar/Search/StyledSuggestions";
import StyledTabs from "components/system/Taskbar/Search/StyledTabs";
import useSearchInputTransition from "components/system/Taskbar/Search/useSearchInputTransition";
import {
  SEARCH_BUTTON_TITLE,
  maybeCloseTaskbarMenu,
} from "components/system/Taskbar/functions";
import useTaskbarItemTransition from "components/system/Taskbar/useTaskbarItemTransition";
import { CloseIcon } from "components/system/Window/Titlebar/WindowActionIcons";
import { useFileSystem } from "contexts/fileSystem";
import { useProcesses } from "contexts/process";
import directory from "contexts/process/directory";
import { type ProcessArguments } from "contexts/process/types";
import { useSession } from "contexts/session";
import Button from "styles/common/Button";
import Icon from "styles/common/Icon";
import {
  FOCUSABLE_ELEMENT,
  KEYPRESS_DEBOUNCE_MS,
  MILLISECONDS_IN_SECOND,
  PICTURES_FOLDER,
  PREVENT_SCROLL,
  SHORTCUT_EXTENSION,
  TRANSITIONS_IN_SECONDS,
  VIDEOS_FOLDER,
} from "utils/constants";
import { haltEvent, label, preloadLibs } from "utils/functions";
import {
  FILE_INDEX,
  SEARCH_INPUT_PROPS,
  SEARCH_LIB,
  useSearch,
} from "utils/search";

type SearchProps = {
  toggleSearch: (showMenu?: boolean) => void;
};

const TABS = ["All", "Documents", "Photos", "Videos"] as const;

const MIN_MULTI_LINE = 550;

export const SINGLE_LINE_HEIGHT_ADDITION = 34;

export type TabName = (typeof TABS)[number];

type TabData = {
  icon: React.JSX.Element;
  subtitle?: string;
  title: string;
};

export const NO_RESULTS = "NO_RESULTS";

const SUGGESTED = [
  "FileExplorer",
  "PortfolioTerminal",
  "Messenger",
  "Browser",
  "Paint",
];

type AboutMeIconProps = {
  size?: number;
};

const LinkedInIcon = ({ size = 56 }: AboutMeIconProps): React.JSX.Element => (
  <svg fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
    <path d="M6.94 8.5H3.56V19h3.38zm.22-3.69C7.16 3.77 6.37 3 5.25 3S3.34 3.77 3.34 4.81c0 1.02.77 1.81 1.87 1.81h.02c1.15 0 1.93-.79 1.93-1.81M20.66 19h-3.38v-5.62c0-1.41-.5-2.37-1.77-2.37-.96 0-1.53.65-1.78 1.27-.09.22-.11.53-.11.85V19H10.24s.04-9.74 0-10.75h3.38v1.52c.45-.7 1.25-1.7 3.05-1.7 2.22 0 3.89 1.45 3.89 4.56z" />
  </svg>
);

const GitHubIcon = ({ size = 56 }: AboutMeIconProps): React.JSX.Element => (
  <svg fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
    <path d="M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.15 0 1.55-.02 2.81-.02 3.19 0 .31.2.67.8.56a11.54 11.54 0 0 0 7.84-10.95C23.5 5.66 18.35.5 12 .5" />
  </svg>
);

const EmailIcon = ({ size = 56 }: AboutMeIconProps): React.JSX.Element => (
  <svg fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
    <path d="M3 5.25h18a1.75 1.75 0 0 1 1.75 1.75v10A1.75 1.75 0 0 1 21 18.75H3A1.75 1.75 0 0 1 1.25 17V7A1.75 1.75 0 0 1 3 5.25m0 1.5a.25.25 0 0 0-.25.25v.2l9.25 6.94 9.25-6.94V7a.25.25 0 0 0-.25-.25zm18.25 2.33-7.94 5.95a2.25 2.25 0 0 1-2.62 0L2.75 9.08V17c0 .14.11.25.25.25h18c.14 0 .25-.11.25-.25z" />
  </svg>
);

const ABOUT_ME_LINKS = [
  {
    Icon: LinkedInIcon,
    title: "LinkedIn",
    url: "https://linkedin.com/in/aareev-srinivasan",
  },
  {
    Icon: GitHubIcon,
    title: "GitHub",
    url: "https://github.com/Aareevs",
  },
  {
    Icon: EmailIcon,
    title: "E-Mail",
    url: "mailto:aareevs@gmail.com",
  },
] as const;

const HIDDEN_RECENT_PIDS = new Set([
  "BoxedWine",
  "Ruffle",
  "Tic80",
  "V86",
  "JSDOS",
  "Quake3",
  "SpaceCadet",
]);

const METADATA = {
  Documents: {
    icon: <Documents />,
    subtitle: "for documents",
    title: "Documents",
  },
  Photos: {
    icon: <Pictures />,
    title: "Photos",
  },
  Videos: {
    icon: <Videos />,
    title: "Videos",
  },
} as Record<TabName, TabData>;

const Details = dynamic(
  () => import("components/system/Taskbar/Search/Details")
);
const ResultSection = dynamic(
  () => import("components/system/Taskbar/Search/ResultSection")
);

const Search: FC<SearchProps> = ({ toggleSearch }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const { recentFiles, updateRecentFiles } = useSession();
  const { lstat, readFile } = useFileSystem();
  const [activeTab, setActiveTab] = useState<TabName>("All");
  const {
    sizes: { search },
  } = useTheme();
  const [menuWidth, setMenuWidth] = useState(MIN_MULTI_LINE);
  const singleLineView = menuWidth < MIN_MULTI_LINE;
  const searchTransition = useTaskbarItemTransition(
    search.maxHeight + (singleLineView ? SINGLE_LINE_HEIGHT_ADDITION : 0),
    true,
    0.1,
    0
  );
  const inputTransition = useSearchInputTransition();
  const [showCaret, setShowCaret] = useState(false);
  const focusOnRenderCallback = useCallback(
    (element: HTMLInputElement | null) => {
      element?.focus(PREVENT_SCROLL);
      setTimeout(() => setShowCaret(true), 400);
      inputRef.current = element;
    },
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const results = useSearch(searchTerm);
  const [bestMatch, setBestMatch] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const filteredRecentFiles = useMemo(
    () =>
      recentFiles.filter(
        ([, pid]) => Boolean(directory[pid]) && !HIDDEN_RECENT_PIDS.has(pid)
      ),
    [recentFiles]
  );
  const { open } = useProcesses();
  const [subResults, setSubResults] = useState<[string, lunr.Index.Result[]][]>(
    []
  );
  const firstResult = useMemo(
    () =>
      activeTab === "All"
        ? results[0]
        : Object.fromEntries(subResults)[activeTab]?.[0],
    [activeTab, results, subResults]
  );
  const listRef = useRef<HTMLDivElement | null>(null);
  const changeTab = useCallback(
    (tab: TabName) => {
      if (inputRef.current) {
        inputRef.current.value = (
          tab === "All"
            ? inputRef.current.value
            : `${tab}: ${inputRef.current.value}`
        ).replace(`${activeTab}: `, "");
        listRef.current?.scrollTo(0, 0);
      }

      setActiveItem("");
      setActiveTab(tab);
    },
    [activeTab]
  );
  const openApp = useCallback(
    (pid: string, args?: ProcessArguments) => {
      toggleSearch(false);
      open(pid, args);
    },
    [open, toggleSearch]
  );
  const openExternalLink = useCallback(
    (url: string) => {
      toggleSearch(false);
      window.open(url, url.startsWith("mailto:") ? "_self" : "_blank");
    },
    [toggleSearch]
  );
  const searchTimeoutRef = useRef(0);
  const preloadedSearch = useRef(false);
  const preloadSearch = useCallback(() => {
    if (!preloadedSearch.current) {
      preloadedSearch.current = true;
      preloadLibs([SEARCH_LIB, FILE_INDEX]);
    }
  }, []);

  useEffect(() => {
    if (
      firstResult?.ref &&
      (!bestMatch || bestMatch !== firstResult?.ref || !activeItem)
    ) {
      setBestMatch(firstResult.ref);

      if (menuRef.current && menuRef.current.clientWidth > MIN_MULTI_LINE) {
        setActiveItem(firstResult.ref);
      }
    } else if (!firstResult && activeItem) {
      setActiveItem("");
    }
  }, [activeItem, bestMatch, firstResult]);

  useEffect(() => {
    const updateMenuWidth = (): void =>
      setMenuWidth(menuRef.current?.clientWidth || 0);

    updateMenuWidth();

    window.addEventListener("resize", updateMenuWidth);

    return () => window.removeEventListener("resize", updateMenuWidth);
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      results
        .reduce(
          async (acc, result) => {
            const currentResults = await acc;
            const extension = extname(result.ref);
            let pid = "";

            if (extension === SHORTCUT_EXTENSION) {
              if (result.ref.startsWith(`${PICTURES_FOLDER}/`)) pid = "Photos";
              else if (result.ref.startsWith(`${VIDEOS_FOLDER}/`)) {
                pid = "VideoPlayer";
              } else {
                ({ pid } = isExistingFile(await lstat(result.ref))
                  ? getCachedShortcut(result.ref)
                  : getShortcutInfo(await readFile(result.ref)));
              }
            } else pid = getProcessByFileExtension(extension);

            if (pid === "Photos") {
              currentResults.Photos.push(result);
            } else if (pid === "VideoPlayer") {
              currentResults.Videos.push(result);
            } else {
              currentResults.Documents.push(result);
            }

            return currentResults;
          },
          Promise.resolve({
            Documents: [] as lunr.Index.Result[],
            Photos: [] as lunr.Index.Result[],
            Videos: [] as lunr.Index.Result[],
          })
        )
        .then((newResults) => setSubResults(Object.entries(newResults)));
    } else {
      setSubResults([]);
    }
  }, [lstat, readFile, results]);

  return (
    <StyledSearch
      ref={menuRef}
      $singleLine={singleLineView}
      id="searchMenu"
      onBlurCapture={(event) =>
        maybeCloseTaskbarMenu(
          event,
          menuRef.current,
          toggleSearch,
          inputRef.current,
          SEARCH_BUTTON_TITLE,
          true
        )
      }
      onKeyDown={({ key }) => {
        if (key === "Escape") toggleSearch(false);
      }}
      {...searchTransition}
      {...FOCUSABLE_ELEMENT}
    >
      <div>
        <div className="content" onContextMenu={haltEvent}>
          <StyledTabs>
            {TABS.filter(
              (tab) =>
                !(menuWidth < 325 && tab === "Videos") &&
                !(menuWidth < 260 && tab === "Photos")
            ).map((tab) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <li
                key={tab}
                className={tab === activeTab ? "active" : undefined}
                onClick={() => changeTab(tab)}
                {...label(
                  tab === "All"
                    ? "Find the most relevant results"
                    : `Find results in ${tab}`
                )}
              >
                {tab}
              </li>
            ))}
          </StyledTabs>
          <nav>
            <Button
              className="close-button"
              onClick={() => toggleSearch(false)}
              {...label("Close Search")}
            >
              <CloseIcon />
            </Button>
          </nav>
          {!searchTerm && activeTab === "All" && (
            <StyledSections
              $singleLine={singleLineView}
              className={singleLineView ? "single-line" : undefined}
            >
              <section>
                <figure>
                  <figcaption>Suggested</figcaption>
                  <StyledSuggestions>
                    {SUGGESTED.map((app) => (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                      <li
                        key={app}
                        onClick={() => openApp(app)}
                        title={directory[app].title}
                      >
                        <figure>
                          <Icon
                            displaySize={32}
                            imgSize={32}
                            src={directory[app].icon}
                          />
                          <figcaption>{directory[app].title}</figcaption>
                        </figure>
                      </li>
                    ))}
                  </StyledSuggestions>
                </figure>
              </section>
              <section>
                {filteredRecentFiles.length > 0 && (
                  <StyledFiles>
                    <figcaption>Recent</figcaption>
                    <ol>
                      {filteredRecentFiles.map(([file, pid, title], index) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                        <li
                          key={`${file}${pid}`}
                          onClick={() => {
                            openApp(pid, { url: file });
                            if (index !== 0) {
                              setTimeout(
                                () => updateRecentFiles(file, pid, title),
                                TRANSITIONS_IN_SECONDS.TASKBAR_ITEM *
                                  MILLISECONDS_IN_SECOND
                              );
                            }
                          }}
                        >
                          <Icon
                            displaySize={16}
                            imgSize={16}
                            src={directory[pid]?.icon}
                          />
                          <h2>{title || basename(file, extname(file))}</h2>
                        </li>
                      ))}
                    </ol>
                  </StyledFiles>
                )}
                <figure className="card">
                  <figcaption>
                    About Me
                  </figcaption>
                  <ol>
                    {ABOUT_ME_LINKS.map(({ Icon: LinkIcon, title, url }) => (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                      <li
                        key={title}
                        onClick={() => openExternalLink(url)}
                        title={title}
                      >
                        <div className="tile-icon">
                          <LinkIcon size={56} />
                        </div>
                        <h4>{title}</h4>
                      </li>
                    ))}
                  </ol>
                </figure>
              </section>
            </StyledSections>
          )}
          {!searchTerm && activeTab !== "All" && (
            <div className="tab">
              {METADATA[activeTab].icon}
              <h1>Search {METADATA[activeTab].title.toLowerCase()}</h1>
              <h3>
                Start typing to search{" "}
                {METADATA[activeTab].subtitle ||
                  METADATA[activeTab].title.toLowerCase()}
              </h3>
            </div>
          )}
          {searchTerm && (
            <StyledResults>
              {(!singleLineView || !activeItem) && (
                <div ref={listRef} className="list">
                  <ResultSection
                    activeItem={activeItem}
                    activeTab={activeTab}
                    openApp={openApp}
                    results={[firstResult || { ref: NO_RESULTS }]}
                    searchTerm={searchTerm}
                    setActiveItem={setActiveItem}
                    title={"Best match" as TabName}
                    details
                  />
                  {results.length > 1 &&
                    subResults.map(
                      ([title, subResult]) =>
                        (activeTab === "All" || activeTab === title) && (
                          <ResultSection
                            key={title}
                            activeItem={activeItem}
                            activeTab={activeTab}
                            changeTab={changeTab}
                            openApp={openApp}
                            results={subResult.filter(
                              (result) => firstResult !== result
                            )}
                            searchTerm={searchTerm}
                            setActiveItem={setActiveItem}
                            title={title as TabName}
                          />
                        )
                    )}
                </div>
              )}
              {activeItem && firstResult && (
                <Details
                  openApp={openApp}
                  setActiveItem={setActiveItem}
                  singleLineView={singleLineView}
                  url={activeItem || firstResult?.ref}
                />
              )}
            </StyledResults>
          )}
        </div>
        <motion.div className="search" {...inputTransition}>
          <SearchIcon />
          <input
            ref={focusOnRenderCallback}
            onChange={() => {
              const tabAppend = activeTab === "All" ? "" : `${activeTab}: `;
              const value = inputRef.current?.value.startsWith(tabAppend)
                ? inputRef.current?.value.replace(tabAppend, "")
                : inputRef.current?.value;

              window.clearTimeout(searchTimeoutRef.current);
              searchTimeoutRef.current = window.setTimeout(
                () => setSearchTerm(value ?? ""),
                searchTimeoutRef.current > 0 ? KEYPRESS_DEBOUNCE_MS : 0
              );
            }}
            onClick={preloadedSearch.current ? undefined : preloadSearch}
            onKeyDown={({ key }) => {
              preloadSearch();

              if (key === "Enter" && firstResult?.ref) {
                const bestMatchElement = menuRef.current?.querySelector(
                  ".list li:first-child figure"
                );

                (bestMatchElement as HTMLElement)?.click();
              }
            }}
            placeholder="Type here to search"
            style={{
              caretColor: showCaret ? undefined : "transparent",
            }}
            {...SEARCH_INPUT_PROPS}
          />
        </motion.div>
      </div>
    </StyledSearch>
  );
};

export default memo(Search);
