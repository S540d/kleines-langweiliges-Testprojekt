# 🏗️ Code Refactoring Plan

## Current State

**script.js: 1220 lines** - Too large, mixed concerns

## Modular Structure Plan

```
js/
├── modules/
│   ├── translations.js      ✅ CREATED (230 lines)
│   ├── tasks.js             📋 TODO (300 lines)
│   ├── ui.js                📋 TODO (250 lines)
│   ├── drag-drop.js         📋 TODO (200 lines)
│   ├── storage.js           📋 TODO (150 lines)
│   └── version.js           📋 TODO (50 lines)
├── script.js                 📋 TODO (150 lines - main orchestrator)
└── config.js                 📋 TODO (50 lines - constants)
```

## Module Breakdown

### ✅ translations.js (CREATED)
**Responsibilities:**
- Language translations object
- Current language state
- Translation getters
- UI update functions for language

**Exports:**
- `translations`
- `currentLanguage`
- `setLanguage(lang)`
- `getTranslation(key)`
- `getRecurringDescription(recurring)`
- `updateLanguageUI(callback)`

### 📋 tasks.js (TODO)
**Responsibilities:**
- Task data structure
- CRUD operations (create, read, update, delete)
- Task movement between segments
- Recurring task logic
- Task state management

**Exports:**
- `tasks` object
- `addTask(text, segment, recurring)`
- `deleteTask(id, segment)`
- `moveTask(id, from, to)`
- `toggleTask(id, segment)`
- `getTasks(segment)`
- `checkRecurringTasks()`

### 📋 ui.js (TODO)
**Responsibilities:**
- DOM element references
- Modal management
- UI rendering
- Event listener setup
- User interactions

**Exports:**
- `renderTask(task)`
- `renderSegment(segmentId)`
- `renderAllTasks()`
- `openModal()`
- `closeModal()`
- `showDragHint()`
- `setupEventListeners()`

### 📋 drag-drop.js (TODO)
**Responsibilities:**
- Drag and drop handlers
- Touch drag for mobile
- Swipe to delete
- Pull to refresh (disabled)

**Exports:**
- `setupDragAndDrop()`
- `setupTouchDrag(element, task)`
- `setupSwipeToDelete(element, task)`
- `handleDragStart(e)`
- `handleDragEnd(e)`
- `handleDrop(e)`

### 📋 storage.js (TODO)
**Responsibilities:**
- Firebase integration
- LocalForage (IndexedDB)
- Save/Load operations
- Export/Import functionality
- Sync logic

**Exports:**
- `saveTasks()`
- `loadTasks()`
- `syncToFirebase()`
- `exportData()`
- `importData(file)`

### 📋 version.js (TODO)
**Responsibilities:**
- Version loading from package.json
- Version display
- Build date

**Exports:**
- `APP_VERSION`
- `BUILD_DATE`
- `loadVersion()`
- `displayVersion()`

### 📋 config.js (TODO)
**Responsibilities:**
- Constants
- Color schemes
- Segment configuration

**Exports:**
- `SEGMENTS`
- `COLORS`
- `STORAGE_KEYS`

## Migration Strategy

### Phase 1: Create Modules ✅ (1/6 done)
- [x] translations.js
- [ ] tasks.js
- [ ] ui.js
- [ ] drag-drop.js
- [ ] storage.js
- [ ] version.js
- [ ] config.js

### Phase 2: Update index.html
```html
<!-- Old -->
<script src="script.js?v=1.3.1"></script>

<!-- New -->
<script type="module" src="js/script.js?v=1.3.1"></script>
```

### Phase 3: Refactor script.js
- Import all modules
- Wire up dependencies
- Remove duplicated code
- Keep only orchestration logic

### Phase 4: Testing
- [ ] Test all functionality
- [ ] Test Firebase sync
- [ ] Test drag and drop
- [ ] Test language switching
- [ ] Test on mobile
- [ ] Test service worker compatibility

### Phase 5: Documentation
- [ ] Update README with new structure
- [ ] Document each module's API
- [ ] Add JSDoc comments

## Benefits

### Before:
- ❌ 1220 lines in one file
- ❌ Mixed concerns
- ❌ Hard to test
- ❌ Hard to maintain
- ❌ No code reuse

### After:
- ✅ ~150-300 lines per module
- ✅ Clear separation of concerns
- ✅ Easier to test
- ✅ Easier to maintain
- ✅ Reusable modules
- ✅ Better code organization

## Implementation Status

**Current:** 1/7 modules created (translations.js)
**Next Step:** Create remaining 6 modules
**Estimated Time:** 2-3 hours for full refactoring
**Risk:** Medium (breaking changes possible)

## Notes

- Use ES6 modules (`import`/`export`)
- Maintain backward compatibility where possible
- Keep auth.js and firebase-config.js separate (already well-organized)
- Service worker cache needs update after refactoring
- Update version to 1.4.0 after completion

## Decision

**Should we continue with full refactoring now or later?**

Pros of now:
- ✅ Fresh in memory
- ✅ Clean slate
- ✅ Better for future development

Pros of later:
- ✅ Current code works
- ✅ No risk of breaking changes
- ✅ Can be done incrementally

**Recommendation:** Continue now if we have time, or create issues for each module and do incrementally.
