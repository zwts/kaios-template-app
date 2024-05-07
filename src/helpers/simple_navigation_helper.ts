export default class SimpleNavigationHelper {
  selector: string;
  element: HTMLElement | null = null;
  scrollSelector: string | null = null;
  private _mutationObserver: MutationObserver;
  private _currentFocus: HTMLElement | null = null;
  private _candidates: HTMLElement[] | undefined;
  constructor(selector: string, element: HTMLElement, scrollSelector: string) {
    this.selector = selector;
    this.element = element;
    this.scrollSelector = scrollSelector;
    this.element.addEventListener('keydown', this.handleEvent.bind(this));
    this._mutationObserver = new MutationObserver(this.refresh.bind(this));
    this._mutationObserver.observe(this.element, {
      childList: true,
      subtree: true
    });
    this.element.addEventListener('focus', this.handleEvent.bind(this));
    this.updateCandidates();
  }

  setFocus(element: HTMLElement) {
    this._currentFocus = element;
    this.scrollIntoView(element);
    if (this.element &&
      this.element.contains(document.activeElement)) {
      element.focus();
    }
  }

  destroy() {
    this.element && this.element.removeEventListener('keydown', this);
    this.element && this.element.removeEventListener('focus', this);
    this._candidates = [];
    this._mutationObserver.disconnect();
    this._currentFocus = null;
    this.element = null;
  }

  setNewFocus() {
    var next = this.findNext();
    if (next) {
      this.scrollIntoView(next);
      next.focus();
      this._currentFocus = next;
    }
  }

  updateCandidates() {
    if (this.element) {
      this._candidates = Array.from(this.element.querySelectorAll(this.selector));
    }
  }

  refresh(mutations: MutationRecord[]) {
    mutations.forEach((mutation) => {
      [].slice.call(mutation.removedNodes).forEach((node) => {
        if (node === this._currentFocus) {
          let next = this.findNext(this._currentFocus);
          if (next) {
            this._currentFocus = next;
          } else {
            this._currentFocus = this.element;
          }
          if (document.activeElement === document.body && this._currentFocus) {
            this.scrollIntoView(this._currentFocus);
            this._currentFocus.focus();
          }
        } else {
        }
      });
    });

    this.updateCandidates();
    // In case all candidates are removed
    // or in case it's initially empty then add candidates
    if (this.element === document.activeElement) {
      this.setNewFocus();
    } else if (document.body === document.activeElement) {
      // Once there're no candidates and document.activeElement loses,
      // we assume the losing document.activeElement is in our scope due to change this time.
      // So we need to focus back to the root.
      this._currentFocus = this.element;
      this.element && this.element.focus();
    }
  }

  handleEvent(evt: Event) {
    if ('keydown' === evt.type) {
      this.onKeyDown(evt as KeyboardEvent);
    } else if ('focus' === evt.type) {
      if (this._currentFocus && this._currentFocus !== this.element) {
        this.scrollIntoView(this._currentFocus);
        this._currentFocus.focus();
        return;
      }
      let next = this.findNext();
      if (next) {
        next.focus();
        this.scrollIntoView(next);
        this._currentFocus = next;
      } else {
        this._currentFocus = this.element;
      }
    }
  }

  onKeyDown(evt: KeyboardEvent) {
    var nextFocus = null;
    var handled = false;
    switch (evt.key) {
      case 'ArrowDown':
        handled = true;
        nextFocus = this.findNext();
        break;
      case 'ArrowUp':
        handled = true;
        nextFocus = this.findPrev();
        break;
      default:
        break;
    }
    if (nextFocus) {
      this.scrollIntoView(nextFocus);
      nextFocus.focus();
      this._currentFocus = nextFocus;
    }
    if (handled) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  scrollIntoView(element: HTMLElement) {
    if (this.scrollSelector) {
      let target = element;
      let found = false;
      while (target && target !== document.body) {
        if (target && target.matches(this.scrollSelector)) {
          found = true;
          target.scrollIntoView(false);
          break;
        }
        target = target.parentNode as HTMLElement;
      }
      if (!found) {
        // In case the parent does no exist.
        element && element.scrollIntoView(false);
      }
    } else if (!this.elementIsVisible(element)) {
      element.scrollIntoView(false);
    }
  }

  elementIsVisible(element: HTMLElement, top = 50, bottom = 30) {
    let visible = true;
    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
      return visible;
    }
    const rects = element.getClientRects();
    for (const rect of rects as unknown as Array<DOMRect>) {
      if (rect.bottom + bottom > window.innerHeight || rect.top < top) {
        visible = false;
        break;
      }
    }
    return visible;
  };


  findNext(element?: HTMLElement | null) {
    const target = element || document.activeElement;
    const candidates = this._candidates;
    if (candidates && candidates.length) {
      let next = 0;
      candidates.some((dom, index) => {
        if (dom === target) {
          next = (index + 1) % candidates.length;
          return true;
        } else {
          return false;
        }
      });
      return candidates[next] || candidates[0];
    } else {
      return null;
    }
  }

  findPrev(element?: HTMLElement) {
    const target = element || document.activeElement;
    const candidates = this._candidates;
    if (candidates && candidates.length) {
      let next = 0;
      candidates.some((dom, index) => {
        if (dom === target) {
          next = ((candidates.length + index) - 1) % candidates.length;
          return true;
        } else {
          return false;
        }
      });
      return candidates[next] || candidates[0];
    } else {
      return null;
    }
  }
}
