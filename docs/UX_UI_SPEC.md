# Life App - UX/UI Specification Document

## Executive Summary

**Life** is a life management mobile app combining Google Calendar integration for schedule management with bank transaction tracking for spending management. This specification focuses on minimalist design principles, ease of use, and professional-grade functionality for busy individuals.

---

## 1. Competitive Analysis

### 1.1 Direct Competitors

#### **Notion**
- **Strengths:** Highly customizable, powerful databases, good calendar integration
- **Weaknesses:** Steep learning curve, overwhelming for simple use cases, not purpose-built for finance
- **UX Lessons:** Modular blocks work well, but simplicity should win for daily use
- **Pain Points:** Setup friction, too many options lead to decision fatigue

#### **Todoist (with Calendar/Twist integrations)**
- **Strengths:** Clean UI, natural language input, excellent task prioritization
- **Weaknesses:** Limited financial features, calendar view is secondary
- **UX Lessons:** Quick-add functionality is essential, smart suggestions reduce friction
- **Pain Points:** No native spending insights, requires multiple apps

#### **YNAB (You Need A Budget)**
- **Strengths:** Purpose-built for budgeting, excellent educational content, proactive approach
- **Weaknesses:** High subscription cost, complex methodology, no calendar integration
- **UX Lessons:** Clear visual hierarchy for financial health, goal-oriented design
- **Pain Points:** Time-intensive manual entry, learning curve for new users

#### **Mint (Sunset 2024) / Monarch Money**
- **Strengths:** Automatic bank sync, spending categorization, bill tracking
- **Weaknesses:** Cluttered interface, excessive ads (Mint), reactive rather than proactive
- **UX Lessons:** Automation reduces friction, but too much data overwhelms
- **Pain Points:** Security concerns with bank linking, notification overload

#### **Daily Pay / Empower**
- **Strengths:** Cash flow focus, payday insights, simple UI
- **Weaknesses:** Limited scheduling features, narrow use case
- **UX Lessons:** Focus on immediate actionable insights

### 1.2 Indirect Competitors

#### **Apple Calendar + Wallet**
- **Strengths:** Native iOS integration, privacy-focused, no third-party trust required
- **Weaknesses:** Wallet spending analysis is limited, no unified view
- **UX Lessons:** Users want consolidation but trust native apps more

#### **Google Calendar + Google Sheets**
- **Strengths:** Free, flexible, cloud-synced
- **Weaknesses:** Manual effort to maintain, not mobile-optimized
- **UX Lessons:** Users cobble together solutions when no good unified option exists

### 1.3 Common Pain Points Identified

1. **Fragmentation** - Users need 3-4 apps to manage life effectively
2. **Notification Fatigue** - Too many alerts lead to app abandonment
3. **Setup Friction** - Complex onboarding loses 40%+ of new users
4. **Visual Clutter** - Information density without hierarchy overwhelms
5. **Trust Issues** - Users hesitant to connect bank accounts to new apps
6. **Feature Bloat** - Trying to do too much reduces core experience quality
7. **Offline Functionality** - Many apps require constant connectivity

### 1.4 Winning UX Patterns for Busy Professionals

| Pattern | Implementation | Impact |
|---------|---------------|--------|
| **Smart Defaults** | Pre-configured categories, sensible time blocks | Reduces setup time by 60% |
| **Progressive Disclosure** | Show essentials, hide details behind taps | Reduces cognitive load |
| **Contextual Actions** | Swipe gestures, long-press menus | Faster task completion |
| **Visual Summaries** | Charts, progress rings, color coding | Quick comprehension |
| **Natural Language Input** | "Meeting tomorrow at 3pm" | Faster data entry |
| **Intelligent Grouping** | Auto-categorize by time/merchant | Less manual work |
| **Micro-interactions** | Haptic feedback, subtle animations | Delight without distraction |

---

## 2. UX Best Practices for Complex Data Apps

### 2.1 Minimalist Design Principles

#### **Core Philosophy: "Less, but Better" - Dieter Rams**

**Data Density Guidelines:**
- Maximum 7-9 items visible without scrolling on main dashboard
- Use whitespace as an active design element (minimum 16pt padding)
- One primary action per screen
- Secondary actions grouped in overflow menus

**Visual Hierarchy (F-Pattern Reading):**
```
┌─────────────────────────────┐
│  [LOGO]  TODAY        [+]   │  ← Brand + Primary Action
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │   KEY METRIC        │    │  ← Most Important Info
│  │   (Large, Bold)     │    │
│  └─────────────────────┘    │
│  ┌────────┐ ┌────────┐      │
│  │  SUB   │ │  SUB   │      │  ← Secondary Info
│  │  DATA  │ │  DATA  │      │
│  └────────┘ └────────┘      │
│                             │
│  [List items...]            │  ← Scrollable Content
└─────────────────────────────┘
```

### 2.2 Information Hierarchy for Dashboard

**Priority Levels:**

| Priority | Content Type | Visual Treatment | Example |
|----------|-------------|------------------|---------|
| **P0** | Today's Critical Info | Large type, high contrast, top position | Next meeting in 30 min |
| **P1** | Daily Summary | Medium type, card layout | Calendar overview + spending |
| **P2** | Recent Activity | Small type, list format | Latest transactions |
| **P3** | Insights/Trends | Subtle, bottom section | "You spent 15% less this week" |

### 2.3 Navigation Patterns for Multi-Feature Apps

#### **Tab Bar Structure (Recommended for Life App)**

```
┌─────┬─────┬─────┬─────┬─────┐
│ 🏠  │ 📅  │  +  │ 💰  │ ⚙️  │
│Home │Cal  │Add  │Money│More │
└─────┴─────┴─────┴─────┴─────┘
```

**Why Tab Bar Wins:**
- Always visible (persistent navigation)
- Muscle memory develops quickly
- iOS users expect this pattern
- Accommodates 3-5 primary destinations

**Alternative: Sidebar Navigation (iPad only)**
- Use for expanded screen real estate
- Show section icons + labels
- Collapsible for focus mode

### 2.4 Dark Mode Implementation

#### **Color Strategy:**

```javascript
// Dark Mode Palette Example
const darkTheme = {
  background: {
    primary: '#000000',      // Pure black for OLED
    secondary: '#1C1C1E',    // Elevated surfaces
    tertiary: '#2C2C2E',     // Grouped content
  },
  text: {
    primary: '#FFFFFF',      // High emphasis
    secondary: '#EBEBF599',  // 60% opacity
    tertiary: '#EBEBF54D',   // 30% opacity
  },
  separators: '#38383A',
};
```

**Best Practices:**
- Use pure black (#000000) for OLED battery savings
- Reduce contrast in dark mode (avoid pure white text on pure black)
- Adjust shadows - they become highlights in dark mode
- Saturate colors by 10-15% to compensate for dark background
- Test with Reduce Transparency accessibility setting

### 2.5 Accessibility Considerations

#### **WCAG 2.1 AA Compliance Targets:**

| Element | Requirement | Implementation |
|---------|-------------|----------------|
| Text Contrast | 4.5:1 minimum | Check with contrast analyzer |
| Large Text | 3:1 minimum | 18pt+ or 14pt bold |
| Touch Targets | 44x44pt minimum | Padding around small elements |
| Color Alone | Never sole indicator | Add icons/patterns |
| Dynamic Type | Support up to 310% | Use UIFontMetrics |
| Reduce Motion | Respect preference | Disable non-essential animations |

**VoiceOver Support:**
- All interactive elements labeled
- Logical reading order
- Group related elements
- Avoid "button" in labels (redundant)

---

## 3. iOS-Specific Guidelines

### 3.1 iOS 18 Human Interface Guidelines

#### **Key Principles:**

1. **Clarity** - Text legible, icons precise, adornments subtle
2. **Deference** - Content is paramount, UI recedes
3. **Depth** - Layers convey hierarchy, motion provides context

#### **iOS 18 New Considerations:**

- **Enhanced Privacy Indicators** - Clear permission states for calendar/bank access
- **Live Activities** - Show ongoing events/spending in Dynamic Island
- **Interactive Widgets** - Quick actions from home screen
- **Journal App Integration** - Life events can suggest journal entries
- **Contact Posters** - Consistent with iOS aesthetic

### 3.2 Device-Specific Navigation

#### **iPhone:**
```
┌─────────────────────┐
│     Status Bar      │  ← 47pt safe area (Dynamic Island)
├─────────────────────┤
│                     │
│      CONTENT        │  ← Primary content area
│    (Scrollable)     │
│                     │
├─────────────────────┤
│  Home | Cal | Money │  ← 83pt with Tab Bar
└─────────────────────┘
        ↑
   34pt Home Indicator
```

#### **iPad:**
- Use **Sidebar** for primary navigation
- Show master-detail view where appropriate
- Support multitasking (Slide Over, Split View)
- Minimum 320pt width for compact column

#### **iPad Sidebar Structure:**
```
┌────────┬─────────────────────────┐
│  LIFE  │                         │
├────────┤                         │
│ 🏠 Home│    Content Area         │
│ 📅 Cal │    (Detail View)        │
│ 💰 Money│                        │
│ ⚙️ Sett│                        │
└────────┴─────────────────────────┘
```

### 3.3 Biometric Authentication UX Flow

#### **Best Practices:**

**First Launch:**
```
1. Welcome Screen (Value proposition)
2. Feature Preview (3-4 swipeable cards)
3. Permission Request (Calendar + Notifications)
4. Bank Connection (Optional - can skip)
5. Quick Preferences (Notification frequency)
6. Dashboard (Immediate value)
```

**Authentication Patterns:**

| Scenario | Behavior |
|----------|----------|
| App Launch | No auth required by default |
| Bank Data Access | Face ID / Touch ID required |
| Export/Sensitive Actions | Biometric or passcode |
| Background Return | Auth if >5 min away |
| Wrong Biometric | Fall back to passcode |

**UI Implementation:**
```swift
// Face ID Prompt
let context = LAContext()
context.localizedReason = "Access your financial data"
// Apple requires specific strings in Info.plist
// NSFaceIDUsageDescription must explain WHY
```

### 3.4 iOS Typography System

#### **Dynamic Type Support:**

```swift
// SF Pro with dynamic sizing
UIFont.preferredFont(forTextStyle: .largeTitle)  // 34pt
UIFont.preferredFont(forTextStyle: .title1)      // 28pt  
UIFont.preferredFont(forTextStyle: .title2)      // 22pt
UIFont.preferredFont(forTextStyle: .title3)      // 20pt
UIFont.preferredFont(forTextStyle: .body)        // 17pt (base)
UIFont.preferredFont(forTextStyle: .callout)     // 16pt
UIFont.preferredFont(forTextStyle: .subheadline) // 15pt
UIFont.preferredFont(forTextStyle: .footnote)    // 13pt
UIFont.preferredFont(forTextStyle: .caption1)    // 12pt
UIFont.preferredFont(forTextStyle: .caption2)    // 11pt
```

---

## 4. Design System

### 4.1 Color Palette

#### **Primary Colors:**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Primary | `#007AFF` | `#0A84FF` | CTAs, active states, links |
| Secondary | `#5856D6` | `#5E5CE6` | Secondary actions, accents |
| Tertiary | `#8E8E93` | `#8E8E93` | Disabled, placeholders |

#### **Semantic Colors:**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Success | `#34C759` | `#30D158` | Positive balance, completed |
| Warning | `#FF9500` | `#FF9F0A` | Approaching limit, caution |
| Error | `#FF3B30` | `#FF453A` | Over budget, alerts |
| Info | `#5AC8FA` | `#64D2FF` | Tips, neutral notices |

#### **Neutral Colors:**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Background | `#F2F2F7` | `#000000` | Screen background |
| Surface | `#FFFFFF` | `#1C1C1E` | Cards, sheets |
| Surface Elevated | `#FFFFFF` | `#2C2C2E` | Grouped content |
| Border | `#C6C6C8` | `#38383A` | Dividers, outlines |
| Text Primary | `#000000` | `#FFFFFF` | Headlines, body |
| Text Secondary | `#3C3C4399` | `#EBEBF599` | Subtitles, hints |
| Text Tertiary | `#3C3C434D` | `#EBEBF54D` | Disabled text |

#### **Extended Palette (Calendar Categories):**

| Category | Color |
|----------|-------|
| Work | `#007AFF` |
| Personal | `#AF52DE` |
| Health | `#34C759` |
| Finance | `#FF9500` |
| Family | `#FF2D55` |
| Travel | `#5856D6` |

### 4.2 Typography Scale

#### **Type Hierarchy:**

| Style | Font | Size | Weight | Line Height | Letter | Usage |
|-------|------|------|--------|-------------|--------|-------|
| H1 | SF Pro Display | 28 | Bold | 34 | -0.4 | Screen titles |
| H2 | SF Pro Display | 22 | Bold | 28 | -0.2 | Section headers |
| H3 | SF Pro Text | 20 | Semibold | 25 | -0.2 | Card titles |
| H4 | SF Pro Text | 17 | Semibold | 22 | -0.2 | List headers |
| Body | SF Pro Text | 17 | Regular | 22 | -0.2 | Primary text |
| Body Emphasis | SF Pro Text | 17 | Semibold | 22 | -0.2 | Important body |
| Callout | SF Pro Text | 16 | Regular | 21 | -0.2 | Secondary text |
| Subhead | SF Pro Text | 15 | Regular | 20 | -0.1 | Metadata |
| Footnote | SF Pro Text | 13 | Regular | 18 | -0.1 | Captions |
| Caption | SF Pro Text | 12 | Regular | 16 | 0 | Small labels |

#### **React Native Implementation:**

```javascript
const typography = {
  h1: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  h2: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  // ... etc
};
```

---

## 5. Component Specifications

### 5.1 Button Styles

#### **Primary Button:**
```javascript
const primaryButton = {
  backgroundColor: '#007AFF',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 10,
  minHeight: 44,
  alignItems: 'center',
  justifyContent: 'center',
};

const primaryButtonText = {
  color: '#FFFFFF',
  fontSize: 17,
  fontWeight: '600',
  fontFamily: 'SFProText-Semibold',
};
```

#### **Secondary Button:**
```javascript
const secondaryButton = {
  backgroundColor: 'transparent',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#007AFF',
  minHeight: 44,
};

const secondaryButtonText = {
  color: '#007AFF',
  fontSize: 17,
  fontWeight: '600',
};
```

#### **Ghost Button:**
```javascript
const ghostButton = {
  backgroundColor: 'transparent',
  paddingHorizontal: 12,
  paddingVertical: 8,
};

const ghostButtonText = {
  color: '#007AFF',
  fontSize: 17,
  fontWeight: '400',
};
```

#### **Floating Action Button (FAB):**
```javascript
const fab = {
  position: 'absolute',
  right: 16,
  bottom: 90, // Above tab bar
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#007AFF',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
  alignItems: 'center',
  justifyContent: 'center',
};
```

### 5.2 Card Designs

#### **Calendar Event Card:**
```
┌─────────────────────────────────┐
│ ● 9:00 AM          45 min       │ ← Time + Duration
│                                 │
│ Q4 Planning Meeting             │ ← Title (H4)
│ Zoom • with Sarah, Mike         │ ← Subtitle (Subhead)
│                                 │
│ [Join] [ reschedule ]           │ ← Actions
└─────────────────────────────────┘
```

```javascript
const calendarCard = {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  marginHorizontal: 16,
  marginVertical: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
};

const timeIndicator = {
  width: 4,
  height: '100%',
  borderRadius: 2,
  backgroundColor: '#007AFF', // Category color
};
```

#### **Transaction Card:**
```
┌─────────────────────────────────┐
│ 🍔    Restaurant Name           │
│       Lunch • 2:30 PM           │
│                    $24.50       │ ← Amount (right-aligned)
│ [Category Chip: Dining]         │
└─────────────────────────────────┘
```

```javascript
const transactionCard = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E5E5EA',
};

const merchantIcon = {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#F2F2F7',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
};

const amount = {
  fontSize: 17,
  fontWeight: '600',
  color: '#000000',
  // Red for expense, green for income
};
```

### 5.3 Form Inputs

#### **Text Field:**
```javascript
const textField = {
  height: 44,
  paddingHorizontal: 12,
  backgroundColor: '#F2F2F7',
  borderRadius: 10,
  fontSize: 17,
  fontFamily: 'SFProText-Regular',
  color: '#000000',
};

const textFieldFocused = {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#007AFF',
};
```

#### **Search Bar:**
```javascript
const searchBar = {
  height: 36,
  backgroundColor: '#E5E5EA',
  borderRadius: 10,
  paddingHorizontal: 12,
  flexDirection: 'row',
  alignItems: 'center',
};

const searchIcon = {
  marginRight: 8,
  color: '#8E8E93',
};
```

### 5.4 Empty States

#### **No Events Today:**
```
┌─────────────────────────────────┐
│                                 │
│         📅                      │
│                                 │
│    No events today              │
│                                 │
│    Enjoy your free time!        │
│    Or plan something.           │
│                                 │
│    [ + Add Event ]              │
│                                 │
└─────────────────────────────────┘
```

```javascript
const emptyState = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 40,
};

const emptyStateIcon = {
  fontSize: 48,
  marginBottom: 16,
};

const emptyStateTitle = {
  fontSize: 20,
  fontWeight: '600',
  color: '#000000',
  marginBottom: 8,
};

const emptyStateMessage = {
  fontSize: 16,
  color: '#8E8E93',
  textAlign: 'center',
  marginBottom: 24,
};
```

### 5.5 Loading States

#### **Skeleton Placeholder:**
```javascript
const skeleton = {
  backgroundColor: '#E5E5EA',
  borderRadius: 4,
  // Use shimmer animation
};

// Shimmer effect via animated gradient
```

#### **Pull-to-Refresh:**
```javascript
// Use RefreshControl in ScrollView
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#007AFF"
      title="Pull to refresh"
    />
  }
>
```

---

## 6. App Structure & Navigation

### 6.1 Recommended Tab Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  TAB 1: HOME            Dashboard & Today Overview      │
│  Icon: house.fill                                       │
│  Content: Today's events, spending snapshot, quick stats│
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TAB 2: CALENDAR        Full Calendar View              │
│  Icon: calendar                                         │
│  Content: Monthly/weekly views, event details           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TAB 3: ADD (Center)    Quick Actions                   │
│  Icon: plus.circle.fill (large, elevated)               │
│  Content: Add event, log expense, quick note            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TAB 4: MONEY           Finances & Spending             │
│  Icon: banknote.fill                                    │
│  Content: Transactions, budgets, insights               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TAB 5: MORE            Settings & Profile              │
│  Icon: ellipsis.circle                                  │
│  Content: Profile, accounts, preferences, help          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Navigation Flow Diagram

```
                    ┌─────────────┐
                    │   LAUNCH    │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
      ┌───────▼────────┐      ┌────────▼────────┐
      │  First Launch  │      │  Returning User │
      │   Onboarding   │      │   (Biometric)   │
      └───────┬────────┘      └────────┬────────┘
              │                         │
              └────────────┬────────────┘
                           │
                    ┌──────▼──────┐
                    │    HOME     │
                    │  (Dashboard)│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼─────┐     ┌──────▼──────┐    ┌─────▼─────┐
  │ CALENDAR  │◄───►│   ADD NEW   │    │   MONEY   │
  └─────┬─────┘     └──────┬──────┘    └─────┬─────┘
        │                  │                  │
        │                  │                  │
   ┌────▼────┐        ┌────▼────┐       ┌────▼────┐
   │• Month  │        │• Event  │       │• Today  │
   │• Week   │        │• Expense│       │• Week   │
   │• Day    │        │• Note   │       │• Month  │
   │• Event  │        └─────────┘       │• Detail │
   └─────────┘                          └─────────┘
        │                                      │
        └──────────────────┬───────────────────┘
                           │
                    ┌──────▼──────┐
                    │    MORE     │
                    │  (Settings) │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌────▼────┐ ┌────▼────┐
        │  Profile  │ │ Accounts│ │  Help   │
        └───────────┘ │ Connected│ │ & About │
                      │• Calendar│ └─────────┘
                      │• Banks   │
                      └──────────┘
```

### 6.3 Screen Hierarchy

```
Life App
├── Home (Dashboard)
│   ├── Today's Summary
│   ├── Quick Actions
│   └── Recent Activity
├── Calendar
│   ├── Month View
│   ├── Week View
│   ├── Day View
│   └── Event Detail
├── Add New (Modal)
│   ├── Add Event
│   ├── Log Expense
│   └── Quick Note
├── Money
│   ├── Transaction List
│   ├── Transaction Detail
│   ├── Budget Overview
│   └── Spending Insights
└── More
    ├── Profile
    ├── Connected Accounts
    ├── Notifications
    ├── Appearance (Dark Mode)
    ├── Security
    └── Help & Support
```

---

## 7. Dashboard Design

### 7.1 Information Priority

```
┌─────────────────────────────────────────┐
│           HOME DASHBOARD                │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Good Morning, Alex 👋          │   │  ← P3: Personal Greeting
│  │  Tuesday, February 4            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ⏰ Next in 30 min              │   │  ← P0: CRITICAL
│  │  Product Review Meeting         │   │     Next Event
│  │  Conference Room B              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌───────────────┐ ┌─────────────────┐ │
│  │  📅 Today     │ │  💰 Today       │ │  ← P1: Summary Cards
│  │  4 events     │ │  $124 spent     │ │     Key Metrics
│  │  2 remaining  │ │  of $150 budget │ │
│  └───────────────┘ └─────────────────┘ │
│                                         │
│  TODAY'S TIMELINE                       │  ← P1: Visual Schedule
│  ─────────────────────────────────────  │
│  9:00 ●────── Team Standup              │
│  10:00○         ┈┈┈┈┈ Focus Time       │
│  11:00●────── Client Call               │
│  12:00○         Lunch (free)            │
│  1:00 ●────── Product Review ⚡         │
│                                         │
│  RECENT TRANSACTIONS          [See All]│  ← P2: Recent Activity
│  ─────────────────────────────────────  │
│  ☕ Starbucks              - $5.50      │
│  🏢 Parking                - $12.00     │
│  💵 Salary Deposit        + $3,200     │
│                                         │
│  WEEKLY INSIGHT                         │  ← P3: Insights
│  ─────────────────────────────────────  │
│  📊 You're 15% under budget this week!  │
│                                         │
└─────────────────────────────────────────┘
```

### 7.2 Widget Recommendations

#### **Home Screen Widgets (iOS):**

**Small Widget (1x1):**
- Next event time + title
- Or: Today's spending total

**Medium Widget (2x1):**
- Next 2-3 events with times
- Mini chart: daily spending vs budget

**Large Widget (2x2):**
- Full day schedule
- Spending breakdown by category

#### **Lock Screen Widgets (iOS 16+):**
- Circular: Next event countdown
- Rectangular: Current event title
- Inline: Spending today

#### **Live Activity (Dynamic Island):**
- Current/upcoming meeting with countdown
- Active spending session (if tracking)

---

## 8. Key Screens Wireframe Description

### 8.1 Login/Register Screen

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│           ┌───────────┐                 │
│           │   LOGO    │                 │
│           │   💎      │                 │
│           └───────────┘                 │
│                                         │
│              L I F E                    │
│         Manage your world               │
│                                         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Continue with Apple            │   │  ← Primary
│  │      🍎                         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Continue with Google           │   │  ← Secondary
│  │      🔍                         │   │
│  └─────────────────────────────────┘   │
│                                         │
│                                         │
│         ───── or ─────                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Email Address                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Password                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Sign In                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Don't have an account? Sign Up         │
│                                         │
│                                         │
│  By continuing, you agree to our        │
│  Terms of Service and Privacy Policy    │
│                                         │
└─────────────────────────────────────────┘
```

**Key Elements:**
- Large tappable areas (min 44pt)
- Apple Sign In (required for iOS apps)
- Clear error messages inline
- Biometric prompt after first successful login
- Skip option for browsing (if applicable)

### 8.2 Dashboard Screen (Detailed)

```
┌─────────────────────────────────────────┐
│ ○○○             9:41              🔋   │  ← Status Bar
├─────────────────────────────────────────┤
│ 👋 Good morning                 ⚙️ 👤  │  ← Header
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ○ NEXT EVENT        9:00 AM    │   │
│  │                                 │   │
│  │  Q4 Planning Meeting            │   │
│  │  Conference Room B              │   │
│  │  with Sarah, Mike, +2           │   │
│  │                                 │   │
│  │  [ Join Meeting ]               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  TODAY'S OVERVIEW         Feb 4, 2025   │
│  ┌─────────────┐ ┌─────────────────┐   │
│  │   📅        │ │      💰         │   │
│  │             │ │                 │   │
│  │   4 events  │ │   $124 spent    │   │
│  │   2 done    │ │   76% of budget │   │
│  │             │ │   ━━━━━━░░░     │   │
│  └─────────────┘ └─────────────────┘   │
│                                         │
│  TIMELINE                        [Week] │
│  ─────────────────────────────────────  │
│  8 AM   ○────── Breakfast               │
│  9 AM   ●══════█ Team Standup   (done)  │
│  10 AM  ○         Focus Time            │
│  11 AM  ●══════ Client Call             │
│  12 PM  ○         Lunch (free)          │
│  1 PM   ●══════ Product Review ⏰ 30m   │
│                                         │
│  💳 RECENT                    [See All] │
│  ─────────────────────────────────────  │
│  ☕ Starbucks         -$5.50   8:30 AM  │
│  🏢 Parking           -$12.00  9:00 AM  │
│  💵 Salary           +$3200    Yesterday│
│                                         │
└─────────────────────────────────────────┤
│  🏠      📅      ➕      💰      ⚙️     │  ← Tab Bar
└─────────────────────────────────────────┘
```

### 8.3 Calendar View Recommendations

#### **Month View:**
```
┌─────────────────────────────────────────┐
│ ←  February 2025            Today  →   │
├─────────────────────────────────────────┤
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat     │
│                                         │
│   26   27   28   29   30   31    1     │
│        ○    ○                   ○○     │
│                                         │
│    2    3   ┌──┐   5    6    7    8    │
│   ○○   ○○   │04│  ○○   ○    ○○   ○    │
│             └──┘                        │
│    9   10   11   12   13   14   15     │
│   ○    ○○   ○    ○○   ○    ○○   ○     │
│                                         │
│   ...                                  │
│                                         │
│  TODAY: February 4                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ● 9:00 AM  Team Standup       [Done]  │
│  ● 11:00 AM Client Call                │
│  ● 1:00 PM  Product Review    ⏰ 30m   │
│  ○ 3:00 PM  1:1 with Manager           │
│                                         │
└─────────────────────────────────────────┘
```

#### **List View (Alternative):**
- Better for dense schedules
- Shows event details inline
- Grouped by day
- Faster scrolling

**Recommendation:** 
- **Default to List View** for busy professionals (faster scanning)
- **Month view** available via toggle for planning
- **Day view** for detailed daily schedule

### 8.4 Transaction List View

```
┌─────────────────────────────────────────┐
│ 💰 Money                    [🔍] [⚙️]  │
├─────────────────────────────────────────┤
│  THIS MONTH                    [Filter]│
│  $2,340 spent    $1,200 remaining      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│  Budget: 65% used                      │
│                                         │
│  TUESDAY, FEBRUARY 4                    │
│  ─────────────────────────────────────  │
│  ☕ Starbucks          -$5.50   8:30 AM │
│     Dining out                          │
│  🏢 Parking            -$12.00  9:00 AM │
│     Transportation                      │
│                                         │
│  MONDAY, FEBRUARY 3                     │
│  ─────────────────────────────────────  │
│  💵 Salary Deposit    +$3,200  All day │
│     Income                              │
│  🛒 Whole Foods        -$89.50  6:30 PM │
│     Groceries                           │
│                                         │
│  SUNDAY, FEBRUARY 2                     │
│  ─────────────────────────────────────  │
│  🎬 Netflix            -$15.99          │
│     Subscriptions                       │
│                                         │
└─────────────────────────────────────────┘
```

### 8.5 Add Transaction Flow

```
FLOW: Tap "+" → Select "Log Expense" → Form

┌─────────────────────────────────────────┐
│  ✕      Log Expense              Save  │
├─────────────────────────────────────────┤
│                                         │
│  AMOUNT                                 │
│  ┌─────────────────────────────────┐   │
│  │  $              24.50           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  MERCHANT                               │
│  ┌─────────────────────────────────┐   │
│  │  Starbucks                      │   │
│  │  🍔 Recent: Chipotle, Uber...   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  CATEGORY                               │
│  ┌─────────────────────────────────┐   │
│  │  ☕ Dining Out                  │   │
│  └─────────────────────────────────┘   │
│  [Quick: 🍔 ☕ 🛒 🚕 🎬 🏥]            │
│                                         │
│  DATE & TIME                            │
│  ┌─────────────────────────────────┐   │
│  │  Today, 9:41 AM                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  NOTE (Optional)                        │
│  ┌─────────────────────────────────┐   │
│  │  Morning coffee                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     📎 Attach Receipt           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [ ] This is a recurring expense        │
│                                         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │        Save Expense             │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 8.6 Profile/Settings Screen

```
┌─────────────────────────────────────────┐
│  More                                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  👤  Alex Johnson               │   │
│  │      alex@email.com             │   │
│  │      Pro Member                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ACCOUNTS                               │
│  ─────────────────────────────────────  │
│  📅 Google Calendar       Connected ✓   │
│  💳 Chase Bank            Connected ✓   │
│  🏦 Wells Fargo           ⚠️ Refresh    │
│                                         │
│  PREFERENCES                            │
│  ─────────────────────────────────────  │
│  🔔 Notifications         ━━━●━━━       │
│  🌙 Dark Mode             Toggle        │
│  📊 Default View          List          │
│  💱 Currency              USD ($)       │
│                                         │
│  SECURITY                               │
│  ─────────────────────────────────────  │
│  🔒 Face ID               On            │
│  🔐 Change Password                   > │
│  📱 Active Sessions                   > │
│                                         │
│  SUPPORT                                │
│  ─────────────────────────────────────  │
│  ❓ Help Center                       > │
│  💬 Contact Support                   > │
│  ⭐ Rate App                          > │
│                                         │
│  ─────────────────────────────────────  │
│  Sign Out                               │
│  Version 1.0.2                          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 9. Interaction Patterns

### 9.1 Pull-to-Refresh

**Implementation:**
```javascript
// Standard iOS pull-to-refresh
const onRefresh = async () => {
  setRefreshing(true);
  await Promise.all([
    syncCalendar(),
    syncTransactions(),
  ]);
  setRefreshing(false);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
```

**Visual:**
- Standard iOS spinner
- Subtle haptic feedback on completion
- No custom animations (follows platform convention)

### 9.2 Swipe Actions

#### **Calendar Events:**
```
┌─────────────────────────────────────────┐
│                                         │
│  [Complete] [Reschedule]  Meeting     │←─┐ Swipe left
│                                         │  │
│  Event ───────> [Delete]                │←─┘ Swipe right
│                                         │
└─────────────────────────────────────────┘
```

#### **Transactions:**
```
┌─────────────────────────────────────────┐
│                                         │
│  [Categorize] [Flag]      Starbucks   │←─┐ Swipe left
│              -$5.50                     │  │
│  Transaction ──> [Hide]                 │←─┘ Swipe right
│                                         │
└─────────────────────────────────────────┘
```

**Implementation:**
```javascript
// Using React Native Swipeable
<Swipeable
  renderLeftActions={leftSwipeActions}
  renderRightActions={rightSwipeActions}
  onSwipeableLeftOpen={onComplete}
  onSwipeableRightOpen={onDelete}
>
  <CalendarEventCard {...props} />
</Swipeable>
```

**Haptic Feedback:**
- Light impact when swipe threshold reached
- Success feedback on action completion

### 9.3 Quick Actions (Haptic Touch)

#### **Home Screen Quick Actions:**
```
App Icon Long Press:
├── Add Event
├── Log Expense  
├── View Today
└── View Spending
```

#### **In-App Peek & Pop:**
- Calendar event: Preview details
- Transaction: Quick view receipt
- Deep press → Expand to full view

#### **Context Menus (iOS 13+):**
```javascript
<ContextMenu
  actions={[
    { title: 'Edit', icon: 'pencil' },
    { title: 'Duplicate', icon: 'doc.on.doc' },
    { title: 'Delete', destructive: true, icon: 'trash' },
  ]}
  onPress={handleAction}
>
  <EventCard {...props} />
</ContextMenu>
```

### 9.4 Search and Filter Patterns

#### **Global Search:**
```
┌─────────────────────────────────────────┐
│ 🔍 Search events, transactions...   ✕  │
├─────────────────────────────────────────┤
│                                         │
│  RECENT SEARCHES                        │
│  ─────────────────────────────────────  │
│  "Starbucks"                          │
│  "Team meeting"                       │
│  "Electric bill"                      │
│                                         │
│  RESULTS                                │
│  ─────────────────────────────────────  │
│  EVENTS (2)                             │
│  • Team Meeting - Jan 15                │
│  • Team Meeting - Feb 1                 │
│                                         │
│  TRANSACTIONS (3)                       │
│  • Starbucks - $5.50 - Feb 4            │
│  • Starbucks - $6.25 - Feb 1            │
│  • Starbucks - $4.80 - Jan 28           │
│                                         │
└─────────────────────────────────────────┘
```

#### **Filter Chips:**
```javascript
// Filter bar component
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  <FilterChip label="All" selected />
  <FilterChip label="This Week" />
  <FilterChip label="Food & Dining" />
  <FilterChip label="Work Events" />
  <FilterChip label="Income" />
</ScrollView>
```

#### **Filter Sheet:**
```
┌─────────────────────────────────────────┐
│         ━━━━━━━━ (drag handle)          │
│  Filter Transactions                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  DATE RANGE                             │
│  [Today] [Week] [Month] [Custom]        │
│                                         │
│  CATEGORIES                             │
│  ☑️ All Categories                      │
│  ☑️ 🍔 Food & Dining                    │
│  ☐ 🚕 Transportation                    │
│  ☑️ 🛒 Shopping                         │
│  ...                                    │
│                                         │
│  AMOUNT                                 │
│  [Min $    ]  to  [Max $    ]           │
│                                         │
│  TYPE                                   │
│  ● All  ○ Expenses only  ○ Income only  │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [    Reset    ] [   Apply 24 results  ]│
└─────────────────────────────────────────┘
```

---

## 10. Implementation Notes

### 10.1 React Native Paper Integration

```javascript
import { 
  Provider as PaperProvider, 
  DefaultTheme,
  Button,
  Card,
  TextInput,
  Chip,
  FAB,
  List,
} from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    error: '#FF3B30',
    success: '#34C759',
  },
};

// Component examples
<Button 
  mode="contained" 
  onPress={handleSubmit}
  style={{ borderRadius: 10 }}
>
  Save
</Button>

<Card style={{ borderRadius: 12, elevation: 2 }}>
  <Card.Content>
    <Title>Event Title</Title>
    <Paragraph>Event details</Paragraph>
  </Card.Content>
</Card>
```

### 10.2 Performance Guidelines

- **List Virtualization:** Use FlatList with getItemLayout for calendar/transactions
- **Image Optimization:** Lazy load receipt images, use thumbnails
- **Animation:** Use NativeDriver for all animations
- **State Management:** Keep UI state local, sync with global periodically
- **Offline First:** Cache data, queue mutations

### 10.3 Security Considerations

- **Bank Data:** Never store credentials, use OAuth/OIDC only
- **Keychain:** Store tokens in iOS Keychain
- **Biometrics:** Use LocalAuthentication framework
- **Screenshots:** Consider preventScreenCapture for sensitive screens
- **Blur on Background:** Hide content in app switcher when sensitive data shown

---

## 11. Summary

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **5-Tab Navigation** | Industry standard, muscle memory, handles core features |
| **List-First Calendar** | Faster scanning for busy professionals |
| **Dashboard-First Home** | Immediate value, glanceable information |
| **Minimal Color Palette** | Reduces visual noise, focuses on content |
| **Native iOS Patterns** | Familiarity, accessibility, platform consistency |
| **Biometric Auth** | Security without friction |
| **Progressive Disclosure** | Complex features don't overwhelm new users |

### Success Metrics

- **Time to Value:** First meaningful dashboard view < 30 seconds
- **Task Completion:** Add event/expense < 3 taps
- **Daily Active Users:** Target 40%+ DAU/MAU ratio
- **Retention:** 60% week-1, 40% month-1
- **App Store Rating:** 4.5+ stars

---

*Document Version: 1.0*  
*Last Updated: February 2, 2025*  
*For: Life Mobile App iOS Development*
