# Grocery Tracker

A mobile-friendly Vue.js web application for managing your grocery lists with Google Sheets integration.

## Features

- 📱 **Mobile-optimized design** - Perfect for phones and tablets
- 🔄 **Google Sheets integration** - Sync with your existing spreadsheets
- 📝 **Two list management**:
  - **Grocery List** - Main inventory with categories and quantities
  - **To Buy List** - Quick items to pick up on the way back
- ⚡ **Progressive Web App** - Install on your device like a native app
- 🎨 **Beautiful UI** - Clean, modern interface

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A Google account with Google Sheets
- Google Cloud Console access for API key

### Installation

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd kirim
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Google Sheets Setup

1. **Create a Google Sheet** with two tabs:
   - `GroceryList` with columns: `Item`, `Category`, `Quantity`
   - `ToBuy` with columns: `Item`, `DateAdded`

2. **Share the sheet**:
   - Click "Share" button
   - Set permissions to "Anyone with the link can view"

3. **Get API Key**:
   - Go to [Google Cloud Console](https://console.developers.google.com/)
   - Create a new project or select existing one
   - Enable the Google Sheets API
   - Create credentials (API Key)
   - Copy the API key

4. **Get Sheet ID**:
   - From your Google Sheets URL: `docs.google.com/spreadsheets/d/SHEET_ID/edit`
   - Copy the `SHEET_ID` part

5. **Configure the app**:
   - Open the app and go to Settings tab
   - Enter your API Key and Sheet ID
   - Test the connection

## Usage

### Grocery List Tab
- View all items in your main grocery inventory
- See categories and quantities for each item
- Toggle between Grocery List and To Buy List

### Add Item Tab
- **Quick Add to Buy List**: Add items you need to buy on the way back
- **Add to Grocery List**: Add items to your main inventory with categories and quantities

### Settings Tab
- Configure Google Sheets credentials
- Test your connection
- View setup instructions

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── components/
│   ├── GroceryList.vue    # Main list view
│   ├── AddItem.vue        # Add items form
│   └── Settings.vue       # Configuration
├── services/
│   └── googleSheets.js    # Google Sheets API service
├── App.vue                # Main app component
└── main.js               # App entry point
```

## Mobile Features

- Responsive design for all screen sizes
- Touch-friendly interface
- PWA capabilities for device installation
- Offline-ready (basic functionality)

## Privacy & Security

- All data is stored in your own Google Sheets
- API key is stored locally in your browser
- No data is sent to external servers (except Google Sheets API)

## Troubleshooting

### Connection Issues
- Ensure your Google Sheet is publicly viewable
- Check that your API key has Google Sheets API enabled
- Verify the Sheet ID is correct
- Make sure sheet tabs are named exactly "GroceryList" and "ToBuy"

### App Issues
- Clear browser cache and localStorage
- Check browser developer console for errors
- Ensure you have a stable internet connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
