import axios from 'axios'

class GoogleSheetsService {
  constructor() {
    this.apiKey = localStorage.getItem('googleApiKey') || ''
    this.sheetId = localStorage.getItem('googleSheetId') || '1ReDbCa34AzTJSvO1-KPPADUok-eaEXEZufThw8yuBfA'
    this.groceryListRange = 'GroceryList!A:C' // Assuming columns: Item, Category, Quantity
    this.toBuyRange = 'ToBuy!A:B' // Assuming columns: Item, DateAdded
    
    // Set default sheet ID if not already set
    if (!localStorage.getItem('googleSheetId')) {
      localStorage.setItem('googleSheetId', this.sheetId)
    }
  }

  setCredentials(apiKey, sheetId) {
    this.apiKey = apiKey
    this.sheetId = sheetId
    localStorage.setItem('googleApiKey', apiKey)
    localStorage.setItem('googleSheetId', sheetId)
  }

  getCredentials() {
    return {
      apiKey: this.apiKey,
      sheetId: this.sheetId
    }
  }

  async getGroceryList() {
    if (!this.apiKey || !this.sheetId) {
      throw new Error('Please configure Google Sheets credentials in Settings')
    }

    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${this.groceryListRange}`,
        {
          params: {
            key: this.apiKey
          }
        }
      )

      const rows = response.data.values || []
      if (rows.length === 0) return []

      // Skip header row if it exists
      const dataRows = rows.slice(1)
      return dataRows.map((row, index) => ({
        id: index + 1,
        item: row[0] || '',
        category: row[1] || '',
        quantity: row[2] || ''
      }))
    } catch (error) {
      console.error('Error fetching grocery list:', error)
      throw new Error('Failed to fetch grocery list. Please check your credentials and sheet permissions.')
    }
  }

  async getToBuyList() {
    if (!this.apiKey || !this.sheetId) {
      throw new Error('Please configure Google Sheets credentials in Settings')
    }

    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${this.toBuyRange}`,
        {
          params: {
            key: this.apiKey
          }
        }
      )

      const rows = response.data.values || []
      if (rows.length === 0) return []

      // Skip header row if it exists
      const dataRows = rows.slice(1)
      return dataRows.map((row, index) => ({
        id: index + 1,
        item: row[0] || '',
        dateAdded: row[1] || new Date().toISOString().split('T')[0]
      }))
    } catch (error) {
      console.error('Error fetching to-buy list:', error)
      throw new Error('Failed to fetch to-buy list. Please check your credentials and sheet permissions.')
    }
  }

  async addItemToBuy(item) {
    if (!this.apiKey || !this.sheetId) {
      throw new Error('Please configure Google Sheets credentials in Settings')
    }

    const dateAdded = new Date().toISOString().split('T')[0]
    
    try {
      const response = await axios.post(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/ToBuy!A:B:append`,
        {
          values: [[item, dateAdded]]
        },
        {
          params: {
            key: this.apiKey,
            valueInputOption: 'RAW'
          }
        }
      )

      return {
        success: true,
        item: item,
        dateAdded: dateAdded
      }
    } catch (error) {
      console.error('Error adding item to buy:', error)
      throw new Error('Failed to add item. Please check your credentials and sheet permissions.')
    }
  }

  async addItemToGroceryList(item, category = '', quantity = '') {
    if (!this.apiKey || !this.sheetId) {
      throw new Error('Please configure Google Sheets credentials in Settings')
    }

    try {
      const response = await axios.post(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/GroceryList!A:C:append`,
        {
          values: [[item, category, quantity]]
        },
        {
          params: {
            key: this.apiKey,
            valueInputOption: 'RAW'
          }
        }
      )

      return {
        success: true,
        item: item,
        category: category,
        quantity: quantity
      }
    } catch (error) {
      console.error('Error adding item to grocery list:', error)
      throw new Error('Failed to add item to grocery list. Please check your credentials and sheet permissions.')
    }
  }

  isConfigured() {
    return !!(this.apiKey && this.sheetId)
  }
}

export default new GoogleSheetsService()
