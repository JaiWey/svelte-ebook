<script>
  import { onMount, onDestroy } from "svelte";
  import Epub from "epubjs";
  import qs from "qs";
  import {
    showMenu,
    ebook,
    ebookName,
    theme,
    fontSize,
    fontFamily,
    minutes,
    metadata,
    navigation,
    pagelist,
    refreshLocation,
    cover,
    isBookmark,
    section,
  } from "../../stores/ebook";
  import {
    getStorageTheme,
    getStorageFontFamily,
    getStorageFontSize,
    setStorageMinutes,
    getStorageMinutes,
    getStorageLocation,
    getStorageBookmark,
    setStorageBookmark,
  } from "../../utils/storage";
  import { rem2px, setCssThemeVar } from "../../utils/utils";
  import { themeList } from "../../utils/constants";
  import EbookHeader from "./EbookHeader.svelte";
  import EbookMenu from "./EbookMenu.svelte";
  import { get } from "svelte/store";
  import EbookBookmark from "./EbookBookmark.svelte";
  import { querystring } from "svelte-spa-router";
  import { getLocalForage } from "../../utils/localForage";

  export let params = {};
  const threshold = rem2px(2.5);
  let reader;
  let _ebook;
  let rendition;
  let isReady = false;

  let firstYPos = -1;
  let offsetY = 0;

  let interval;

  onDestroy(() => interval && clearInterval(interval));

  onMount(() => {
    const urlFile = params.filename;
    if (urlFile.indexOf("|") > 0) {
      ebookName.set(urlFile.split("|").join("/"));
      // 实时下载电子书
      init(`APP_EPUB_URL/${this.fileName}.epub`);
    } else {
      ebookName.set(urlFile);
      getLocalForage(urlFile, (err, blob) => {
        if (!err) {
          if (blob) {
            // 离线阅读
            init(blob);
          } else {
            // 在线阅读
            const parsed = qs.parse($querystring);
            const opf = parsed.opf;
            if (opf) {
              init(opf);
            }
          }
        }
      });
    }
  });

  function init(target) {
    initEpub(target);
    parseBook();
    interval = setInterval(() => {
      const m = $minutes;
      minutes.update((m) => m + 1);
      setStorageMinutes(params.filename, m + 1);
    }, 60 * 1000);
  }

  function initEpub(target) {
    _ebook = new Epub(target);
    ebook.set(_ebook);
    initRendition(target);
    minutes.set(getStorageMinutes(target));
  }

  function initRendition(name) {
    rendition = _ebook.renderTo("reader", {
      width: window.innerWidth,
      height: window.innerHeight,
      method: "default",
    });
    const currentTheme = getStorageTheme(name);
    const currentFontSize = getStorageFontSize(name);
    const currentFontFamily = getStorageFontFamily(name);
    const currentLocation = getStorageLocation(name);
    theme.set(currentTheme);
    fontSize.set(currentFontSize);
    fontFamily.set(currentFontFamily);

    registerTheme();
    rendition.themes.select(currentTheme);
    setCssThemeVar(currentTheme);

    addFontCss(rendition);

    rendition.themes.fontSize(currentFontSize);
    if (currentFontFamily === "Default") {
      rendition.themes.font("Times New Roman");
    } else {
      rendition.themes.font(currentFontFamily);
    }
    if (currentLocation) {
      rendition.display(currentLocation);
    } else {
      rendition.display();
    }
    // rendition.display().then(() => {
    //   rendition.themes.fontSize(currentFontSize);
    //   if (currentFontFamily === "Default") {
    //     rendition.themes.font("Times New Roman");
    //   } else {
    //     rendition.themes.font(currentFontFamily);
    //   }
    // });
  }

  function registerTheme() {
    themeList.forEach((t) => {
      rendition.themes.register(t.name, t.style);
    });
  }

  function addFontCss(rendition) {
    rendition.hooks.content.register((contents) => {
      contents.addStylesheet("APP_RES_URL/fonts/daysOne.css");
      contents.addStylesheet("APP_RES_URL/fonts/tangerine.css");
      contents.addStylesheet("APP_RES_URL/fonts/montserrat.css");
      contents.addStylesheet("APP_RES_URL/fonts/cabin.css");
    });
  }

  function parseBook() {
    _ebook.loaded.metadata.then((m) => {
      metadata.set(m);
    });
    _ebook.coverUrl().then((url) => {
      cover.set(url);
    });
    _ebook.loaded.navigation.then((nav) => {
      console.log(nav);
      const navItem = (function flatten(arr) {
        return [].concat(...arr.map((v) => [v, ...flatten(v.subitems)]));
      })(nav.toc);

      function find(item, v = 0) {
        const parent = navItem.filter((it) => it.id === item.parent)[0];
        return !item.parent ? v : parent ? find(parent, ++v) : v;
      }

      navItem.forEach((item) => {
        item.level = find(item);
        item.total = 0;
        item.pagelist = [];
        if (item.href.match(/^(.*)\.html$/)) {
          item.idhref = item.href.match(/^(.*)\.html$/)[1];
        } else if (item.href.match(/^(.*)\.xhtml$/)) {
          item.idhref = item.href.match(/^(.*)\.xhtml$/)[1];
        }
      });
      console.log(navItem);
      navigation.set(navItem);
      _ebook.ready
        .then(() => {
          return _ebook.locations.generate(
            750 *
              (window.innerWidth / 375) *
              (getStorageFontSize($ebookName) / 16)
          );
        })
        .then((locations) => {
          locations.forEach((location) => {
            const loc = location.match(/\[(.*)\]!/)[1];
            const nav = get(navigation);
            nav.forEach((item) => {
              if (item.idhref && item.idhref.indexOf(loc) >= 0) {
                item.pagelist.push(location);
              }
            });
            let currentPage = 1;
            nav.forEach((item, index) => {
              if (index === 0) {
                item.page = 1;
              } else {
                item.page = currentPage;
              }
              currentPage += item.pagelist.length + 1;
            });
            navigation.set(nav);
          });
          //   // saveNavigation(this.fileName, this.navigation)
          pagelist.set(locations);
          //   this.setBookAvailable(true)
          //   this.setIsPaginating(false)
          refreshLocation();
          isReady = true;
        });
    });
  }

  function setAndSaveBookmark() {
    const bookmark = getStorageBookmark($ebookName);
    const currentLocation = $ebook.rendition.currentLocation();
    const cfibase = currentLocation.start.cfi
      .replace(/!.*/, "")
      .replace("epubcfi(", "");
    const cfistart = currentLocation.start.cfi
      .replace(/.*!/, "")
      .replace(/\)/, "");
    const cfiend = currentLocation.end.cfi.replace(/.*!/, "").replace(/\)/, "");
    const cfiRange = `epubcfi(${cfibase}!,${cfistart},${cfiend})`;
    const cfi = currentLocation.start.cfi;
    $ebook.getRange(cfiRange).then((range) => {
      let text = range.toString();
      text = text.replace(/\s\s/g, "");
      text = text.replace(/\r/g, "");
      text = text.replace(/\n/g, "");
      text = text.replace(/\t/g, "");
      text = text.replace(/\f/g, "");
      bookmark.push({
        cfi: cfi,
        text: text,
      });
      isBookmark.set(true);
      setStorageBookmark($ebookName, bookmark);
    });
  }

  function removeBookmark() {
    const currentLocation = $ebook.rendition.currentLocation();
    const cfi = currentLocation.start.cfi;
    const bookmark = getStorageBookmark($ebookName);
    setStorageBookmark(
      $ebookName,
      bookmark.filter((item) => item.cfi !== cfi)
    );
    isBookmark.set(false);
  }

  function nextPage() {
    if (isReady) {
      rendition.next();
      showMenu.set(false);
      refreshLocation();
    }
  }

  function prevPage() {
    if (isReady) {
      rendition.prev();
      showMenu.set(false);
      refreshLocation();
    }
  }

  function onClick(e) {
    if (isReady) {
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX < width * 0.3) {
        prevPage();
      } else if (offsetX > width * 0.7) {
        nextPage();
      } else {
        showMenu.update((s) => !s);
      }
    }
  }

  function mouseDown(e) {
    //console.log('mousedown', e)
  }

  function mouseMove(e) {
    // console.log("mousemove", e);
    // offsetY =
  }

  function mouseUp(e) {
    // console.log("mouseup", e);
  }

  function touchStart(e) {
    //console.log('touchstart', e)
  }

  function touchMove(e) {
    if (isReady && !$showMenu) {
      if (firstYPos < 0) {
        firstYPos = e.changedTouches[0].clientY;
      } else if (e.changedTouches[0].clientY - firstYPos > 0) {
        offsetY = e.changedTouches[0].clientY - firstYPos;
        console.log("c", offsetY);
      }
    }
  }

  function touchEnd(e) {
    if (isReady && !$showMenu) {
      if (offsetY > threshold) {
        if ($isBookmark) {
          removeBookmark();
        } else {
          setAndSaveBookmark();
        }
      }
      firstYPos = -1;
      offsetY = 0;
      reader.style.transition = "top 0.15s linear";
      setTimeout(() => {
        reader.style.transition = "";
      }, 200);
    }
  }
</script>

<div class="ebook-reader" bind:this={reader} style="top: {offsetY}px;">
  <div class="ebook-component">
    <div
      class="ebook-reader-mask"
      on:click={onClick}
      on:mousedown={mouseDown}
      on:mousemove={mouseMove}
      on:mouseup={mouseUp}
      on:touchstart={touchStart}
      on:touchmove={touchMove}
      on:touchend={touchEnd}
    />
    <div class="reader-wrapper">
      <div id="reader" />
    </div>
  </div>
  <EbookHeader />
  <EbookMenu />
</div>
<EbookBookmark {offsetY} {threshold} />

<style type="postcss">
  .ebook-reader {
    @apply relative h-full;
  }
  .ebook-reader-mask {
    @apply absolute inset-0;
    z-index: 1;
  }
</style>
