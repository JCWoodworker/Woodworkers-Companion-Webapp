# iOS to React Conversion Guide - Woodworker's Companion

## Overview

This guide provides complete instructions for converting the iOS SwiftUI app to a React web application. The app includes a main landing page with 9 tool tiles, where Tool 1 is a fully-featured Board Foot Calculator and Tools 2-9 are placeholder pages.

## Project Structure

### Target File Organization

```
src/
├── components/
│   ├── HomePage.tsx (main landing page)
│   ├── tools/
│   │   ├── BoardFootCalculator/
│   │   │   ├── BoardFootCalculatorView.tsx
│   │   │   ├── BoardFootViewModel.ts
│   │   │   ├── components/
│   │   │   │   ├── UnitToggle.tsx
│   │   │   │   ├── InputSection.tsx
│   │   │   │   ├── BoardList.tsx
│   │   │   │   ├── Summary.tsx
│   │   │   │   ├── EditBoardModal.tsx
│   │   │   │   ├── HistoryView.tsx
│   │   │   │   ├── OrderDetailModal.tsx
│   │   │   │   └── SaveOrderModal.tsx
│   │   ├── Tool2View.tsx
│   │   ├── Tool3View.tsx
│   │   ├── Tool4View.tsx
│   │   ├── Tool5View.tsx
│   │   ├── Tool6View.tsx
│   │   ├── Tool7View.tsx
│   │   ├── Tool8View.tsx
│   │   └── Tool9View.tsx
├── models/
│   ├── Tool.ts
│   ├── BoardFootModels.ts
│   └── SavedOrderModels.ts
├── utils/
│   └── localStorage.ts
└── styles/
    └── theme.css
```

## Phase 1: Setup Theme and Core Models

### Step 1.1: Create Color Theme (src/styles/theme.css)

Add these CSS custom properties to your existing App.css or create a new theme.css:

```css
:root {
  --wood-primary: #8B6F47;
  --wood-secondary: #D4A574;
  --forest-green: #6B8E23;
  --cream-background: #F5F5DC;
  --dark-brown: #3E2723;
}

body {
  background-color: var(--cream-background);
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

### Step 1.2: Create Tool Model (src/models/Tool.ts)

```typescript
export interface Tool {
  id: number;
  name: string;
}

export const allTools: Tool[] = [
  { id: 1, name: "Board Foot Calculator" },
  { id: 2, name: "Tool 2" },
  { id: 3, name: "Tool 3" },
  { id: 4, name: "Tool 4" },
  { id: 5, name: "Tool 5" },
  { id: 6, name: "Tool 6" },
  { id: 7, name: "Tool 7" },
  { id: 8, name: "Tool 8" },
  { id: 9, name: "Tool 9" },
];
```

### Step 1.3: Create Board Foot Models (src/models/BoardFootModels.ts)

Convert the iOS Swift models to TypeScript. Reference: `BoardFootModels.swift` lines 10-230

Key types to create:

- `MeasurementUnit` enum (Imperial/Metric)
- `LengthUnit` enum (feet/inches)
- `PricingType` enum (Per Board Foot/Linear)
- `WoodSpecies` constant array
- `BoardEntry` interface with all calculation methods
- `LumberPreset` interface with preset arrays

Important calculation formulas from Swift:

- Imperial board feet: `(thickness/4 * width * lengthInFeet / 12) * quantity`
- Metric board feet: `(thickness * width * length / 2359.737) * quantity`
- Linear cost: `length * price * quantity`

### Step 1.4: Create Saved Order Models (src/models/SavedOrderModels.ts)

Convert from `SavedOrderModels.swift` lines 16-93:

- `SavedOrder` interface
- `exportText()` method to generate formatted export strings

## Phase 2: LocalStorage Implementation

### Step 2.1: Create Storage Utils (src/utils/localStorage.ts)

Implement the iOS `OrderPersistenceManager` functionality:

- `saveOrder(order: SavedOrder): void`
- `loadOrders(): SavedOrder[]`
- `deleteOrder(orderId: string): void`
- `getNextOrderNumber(): number`
- `saveWorkInProgress(boards: BoardEntry[]): void`
- `loadWorkInProgress(): BoardEntry[] | null`
- `clearWorkInProgress(): void`

Use `localStorage` with keys:

- `"savedOrders"` for saved orders
- `"workInProgress"` for auto-save

## Phase 3: Main Landing Page

### Step 3.1: Replace HomePage Component (src/components/HomePage.tsx)

Convert from `ContentView.swift` lines 131-198

**Key Features:**

1. **Responsive Grid**:

   - 2 columns on mobile (width < 768px)
   - 3 columns on tablet/desktop (width >= 768px)
   - Use CSS media queries or window resize hooks

2. **Logo Section**:

   - Placeholder image (same size as tiles)
   - Rounded corners (12px border-radius)
   - Box shadow: `0 4px 8px rgba(0,0,0,0.2)`
   - Use a simple SVG placeholder or colored div

3. **Subtitle**:

   - Text: "A collection of tools for woodworkers"
   - Centered, medium font weight

4. **Tool Tiles** (ToolTile component):

   - Square aspect ratio (1:1)
   - Gradient background: linear-gradient from `--wood-secondary` to `--wood-primary` (top-left to bottom-right)
   - Border radius: 12px
   - Box shadow: `0 4px 6px rgba(0,0,0,0.3)` (normal), `0 1px 2px rgba(0,0,0,0.1)` (pressed)
   - Press animation: scale(0.97) with spring animation
   - Text styling:
     - Font size: 16% of tile width (use ResizeObserver or calc)
     - Bold, white color
     - Text shadow: `0 1px 2px rgba(0,0,0,0.3)`
     - Centered both horizontally and vertically
     - Line clamp: 3 lines max
     - Padding: 12px horizontal, 8px vertical

5. **Navigation**:

   - Click tile -> navigate to `/tool/:id` using react-router

6. **Layout Constraints**:

   - Max width: 700px
   - Horizontal padding: 24px
   - Tile spacing: 16px
   - Center content on larger screens

## Phase 4: Tool Placeholder Pages (Tools 2-9)

### Step 4.1: Create Tool Views (src/components/tools/Tool2View.tsx through Tool9View.tsx)

Convert from `Tool2View.swift` lines 10-46

Each tool page should have:

- Cream background (full screen)
- Centered tool name (e.g., "Tool 2")
- Home button (top-left corner):
  - House icon
  - Circular background with shadow
  - Navigate back to "/" on click
- Hide from tool pages during navigation

Copy this structure for all 9 tool views, just changing the tool number/name.

## Phase 5: Board Foot Calculator - Core View

### Step 5.1: Create Main Calculator View (src/components/tools/BoardFootCalculator/BoardFootCalculatorView.tsx)

Convert from `BoardFootCalculatorView.swift` lines 10-181

**State Management:**

- Use React hooks (useState) or a custom hook for the ViewModel
- State includes:
  - Selected unit (imperial/metric)
  - Length unit (feet/inches)
  - Input fields (thickness, width, length, quantity, woodSpecies, price)
  - Pricing type
  - Boards array
  - Modal states (export, save, history, edit)

**Layout:**

- Scrollable container with cream background
- Title: "Board Foot Calculator"
- Unit toggle (Imperial/Metric)
- Input section
- "Save Order" button (only when boards exist)
- Board list (only when boards exist)
- Summary section (only when boards exist)
- Export/Clear buttons (only when boards exist)
- Home button (top-left, positioned absolutely)
- History button (top-right, positioned absolutely)

**Auto-save:**

- Use useEffect to save boards to localStorage whenever they change
- Load work-in-progress on component mount

## Phase 6: Board Foot Calculator - Components

### Step 6.1: Unit Toggle Component (src/components/tools/BoardFootCalculator/components/UnitToggle.tsx)

Convert from `UnitToggleView` lines 184-214

Segmented control with two options:

- Imperial / Metric
- Styled with active state (wood-primary background)
- Smooth transition animation

### Step 6.2: Input Section Component (src/components/tools/BoardFootCalculator/components/InputSection.tsx)

Convert from `InputSectionView` lines 217-354

**Sub-components needed:**

- DimensionInputField (lines 357-380)
- ThicknessQuartersInputField (lines 383-416) - special handling for Imperial thickness
- WoodSpeciesPickerField (lines 419-454) with dropdown/modal
- LengthInputFieldWithToggle (lines 506-560)

**Pricing Type Toggle:**

- Per Board Foot / Linear options
- Changes which fields are required

**Conditional Fields:**

- Board Foot pricing: show thickness, width, length, quantity
- Linear pricing: only show length, quantity
- Imperial thickness: show as quarters (e.g., "8/4")
- Length toggle (feet/inches) for Imperial only

**Add Board Button:**

- Green background when enabled
- Gray/disabled when fields incomplete
- Clear dimension fields after adding (keep price and species)

### Step 6.3: Board List Component (src/components/tools/BoardFootCalculator/components/BoardList.tsx)

Convert from `BoardListView` and `BoardRowView` lines 563-641

**Features:**

- List of added boards
- Each row shows:
  - Formatted dimensions (e.g., "8/4\" × 6\" × 8' - Oak")
  - Board feet (if applicable)
  - Pricing info
  - Total cost for that entry
- Delete button (trash icon, red)
- Click row to edit (opens EditBoardModal)

### Step 6.4: Summary Component (src/components/tools/BoardFootCalculator/components/Summary.tsx)

Convert from `SummarySectionView` lines 644-709

Shows:

- Total Board Feet (if any)
- Total Cost (if any)
- Styled with gradient border and background

Action buttons:

- Export (opens export modal/sheet)
- Clear All (confirmation dialog, clears all boards)

### Step 6.5: Edit Board Modal (src/components/tools/BoardFootCalculator/components/EditBoardModal.tsx)

Convert from `EditBoardView.swift` lines 10-253

Modal/dialog with:

- All dimension fields (pre-populated)
- Pricing type toggle
- Wood species picker
- Price input
- Cancel button
- Save button (disabled if invalid)
- Update board in list on save

### Step 6.6: Save Order Modal (src/components/tools/BoardFootCalculator/components/SaveOrderModal.tsx)

Convert from `SaveOrderView.swift` lines 10-87

Simple modal with:

- Text input for order name
- "Skip Naming and Save" button (auto-generates name like "Order 1")
- "Save" button (uses entered name)
- "Cancel" button
- On save: create SavedOrder, save to localStorage, clear form and work-in-progress

### Step 6.7: History View (src/components/tools/BoardFootCalculator/components/HistoryView.tsx)

Convert from `HistoryView.swift` lines 10-258

**Full-screen overlay view showing:**

- Title: "Order History"
- Back button (top-left, returns to calculator)
- Delete All button (top-right, with confirmation)
- Empty state if no orders

**Responsive Display:**

- **Mobile (< 768px)**: Card view (lines 299-365)
  - Order name (bold)
  - Date and time with icons
  - Total cost (highlighted)
  - Swipe actions: Delete, Edit, Share

- **Tablet/Desktop (>= 768px)**: Table view (lines 261-296)
  - Columns: Order Name, Date, Time, Total
  - Header row
  - Click row to view details
  - Swipe actions: Delete, Edit, Share

**Actions:**

- Click order -> open OrderDetailModal
- Edit -> load order into calculator and close history
- Share -> use Web Share API or copy to clipboard
- Delete -> remove from localStorage

### Step 6.8: Order Detail Modal (src/components/tools/BoardFootCalculator/components/OrderDetailModal.tsx)

Convert from `OrderDetailView.swift` lines 10-84

Shows:

- Order name as title
- Export text in monospaced font (scrollable)
- Share/Print button (Web Share API or window.print())
- Delete Order button (with confirmation)
- Done button

## Phase 7: Board Foot Calculator - View Model

### Step 7.1: Create ViewModel Hook (src/components/tools/BoardFootCalculator/BoardFootViewModel.ts)

Convert logic from `BoardFootViewModel.swift` lines 12-203

Create a custom React hook: `useBoardFootViewModel()`

**State:**

- All input fields
- Boards array
- Computed values (totalBoardFeet, totalCost, canAddBoard)

**Methods:**

- `addBoard()`: validate inputs, create BoardEntry, add to array
- `removeBoard(id)`: filter out board
- `updateBoard(updatedBoard)`: replace board with same id
- `clearAll()`: reset everything
- `exportData()`: generate formatted export string with species breakdown

**Validation:**

- Board foot pricing: require thickness, width, length, quantity > 0
- Linear pricing: require length, quantity > 0

## Phase 8: Routing Setup

### Step 8.1: Update App.tsx

Add routes for all tools:

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
  <Route path="/support" element={<SupportPage />} />
  <Route path="/tool/1" element={<BoardFootCalculatorView />} />
  <Route path="/tool/2" element={<Tool2View />} />
  <Route path="/tool/3" element={<Tool3View />} />
  <Route path="/tool/4" element={<Tool4View />} />
  <Route path="/tool/5" element={<Tool5View />} />
  <Route path="/tool/6" element={<Tool6View />} />
  <Route path="/tool/7" element={<Tool7View />} />
  <Route path="/tool/8" element={<Tool8View />} />
  <Route path="/tool/9" element={<Tool9View />} />
</Routes>
```

## Phase 9: Styling Details

### Key CSS Requirements:

**Responsive Breakpoint:**

```css
@media (max-width: 767px) {
  /* Mobile: 2 columns */
}

@media (min-width: 768px) {
  /* Tablet/Desktop: 3 columns */
}
```

**Button Styles:**

- Primary: wood-primary background, white text
- Success: forest-green background, white text  
- Danger: red with 0.7 opacity, white text
- All buttons: border-radius 10px, shadow, padding 14px vertical

**Input Styles:**

- White background
- Border: 1px solid wood-primary with 0.3 opacity
- Border-radius: 8px
- Padding: 12px
- Dark brown text

**Card/Section Styles:**

- White background with 0.6 opacity
- Border-radius: 12px
- Padding: 16px
- Optional: gradient backgrounds for special sections

## Phase 10: Important Implementation Notes

### Calculation Accuracy:

- Use proper decimal handling for board feet calculations
- Format currency to 2 decimal places
- Handle division by zero

### Local Storage:

- Serialize/deserialize dates properly
- Handle JSON parsing errors gracefully
- Clear work-in-progress after saving order

### Responsive Text Sizing:

- Tool tile text MUST be same size across all tiles
- Use CSS clamp() or ResizeObserver to calculate 16% of tile width
- Allow text to wrap (3 line max) but maintain consistent font size

### Animations:

- Tile press: scale(0.97) with cubic-bezier easing
- Modal open/close: fade and slide transitions
- Unit toggle: smooth background transition (0.2s ease-in-out)

### Accessibility:

- Proper semantic HTML
- Button labels for icon-only buttons
- Form labels for all inputs
- Keyboard navigation support

## Testing Checklist

After implementation, verify:

- [ ] HomePage displays correctly on mobile (2 columns) and desktop (3 columns)
- [ ] Tool tiles have consistent text sizing
- [ ] All 9 tool pages are accessible and have working back button
- [ ] Board Foot Calculator loads and saves work-in-progress
- [ ] Imperial board foot calculation is correct (test: 8/4" × 6" × 8' × 1 = 8.0 bf)
- [ ] Metric board foot calculation is correct
- [ ] Linear pricing works (no board feet shown)
- [ ] Can add, edit, and delete boards
- [ ] Can save orders with custom names
- [ ] Can save orders with auto-generated names
- [ ] History view displays correctly on mobile (cards) and desktop (table)
- [ ] Can view order details
- [ ] Can delete orders
- [ ] Can share/export order data
- [ ] Edit from history loads order into calculator
- [ ] Work-in-progress persists across page refreshes
- [ ] Clear all works correctly
- [ ] Delete all orders works with confirmation
- [ ] All responsive breakpoints work smoothly
- [ ] Wood species picker works
- [ ] Species breakdown in export is correct

## File Reference Map

For detailed implementation, reference these iOS files:

| React File | iOS Source File | Lines |

|------------|----------------|-------|

| HomePage.tsx | ContentView.swift | 48-198 |

| Tool.ts | Tool.swift | 10-26 |

| Tool2View.tsx (and 3-9) | Tool2View.swift | 10-46 |

| BoardFootModels.ts | BoardFootModels.swift | 10-230 |

| SavedOrderModels.ts | SavedOrderModels.swift | 16-93 |

| BoardFootCalculatorView.tsx | BoardFootCalculatorView.swift | 10-181 |

| BoardFootViewModel.ts | BoardFootViewModel.swift | 12-203 |

| UnitToggle.tsx | ContentView.swift | 184-214 |

| InputSection.tsx | ContentView.swift | 217-354 |

| BoardList.tsx | ContentView.swift | 563-641 |

| Summary.tsx | ContentView.swift | 644-709 |

| EditBoardModal.tsx | EditBoardView.swift | 10-253 |

| HistoryView.tsx | HistoryView.swift | 10-370 |

| OrderDetailModal.tsx | OrderDetailView.swift | 10-84 |

| SaveOrderModal.tsx | SaveOrderView.swift | 10-87 |

| localStorage.ts | SavedOrderModels.swift | 96-165 |

## Color Reference

```
Wood Primary: #8B6F47
Wood Secondary: #D4A574
Forest Green: #6B8E23
Cream Background: #F5F5DC
Dark Brown: #3E2723
```

## Implementation Order

Recommended sequence:

1. Theme and models setup (Phase 1-2)
2. Main landing page (Phase 3)
3. Tool placeholder pages (Phase 4)
4. Board Foot Calculator shell (Phase 5)
5. Calculator components one by one (Phase 6)
6. Calculator logic/ViewModel (Phase 7)
7. Routing integration (Phase 8)
8. Styling polish (Phase 9)
9. Testing and fixes (Phase 10)

This guide provides all necessary information to recreate the iOS app functionality in React. Follow each phase sequentially and reference the iOS source files for exact behavior details.