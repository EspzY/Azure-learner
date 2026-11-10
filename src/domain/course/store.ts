import { courseKey, freshCourse, restoreCourse, type CourseSave } from './model';
import type { LearningStorage, LearningIssue } from '../curriculum/store';
export class CourseStore {
  private view: { save: CourseSave; ready: boolean; issue: LearningIssue } = {
    save: freshCourse(),
    ready: false,
    issue: null,
  };
  private base: string | null = null;
  private readonly serverView = this.view;
  getServerSnapshot = () => this.serverView;
  private listeners = new Set<() => void>();
  constructor(private storage: LearningStorage) {}
  getSnapshot = () => this.view;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private publish(view: typeof this.view) {
    this.view = view;
    for (const fn of this.listeners) fn();
  }
  load = () => {
    try {
      this.base = this.storage.getItem(courseKey);
      this.publish({ ...restoreCourse(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(courseKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  update = (save: CourseSave) => {
    if (!this.view.ready || ['corrupt', 'unsupported', 'conflict'].includes(this.view.issue ?? ''))
      return false;
    const raw = JSON.stringify(save);
    if (restoreCourse(raw).issue) return false;
    if (raw === JSON.stringify(this.view.save)) return true;
    try {
      if (this.storage.getItem(courseKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      this.publish({ save, ready: true, issue: 'unsaved' });
      return true;
    }
    try {
      this.storage.setItem(courseKey, raw);
      this.base = raw;
      this.publish({ save, ready: true, issue: null });
    } catch {
      this.publish({ save, ready: true, issue: 'unsaved' });
    }
    return true;
  };
  clear = () => {
    let issue: LearningIssue = null;
    try {
      this.storage.removeItem(courseKey);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: freshCourse(), ready: true, issue });
  };
}
