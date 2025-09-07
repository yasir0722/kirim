import axios from 'axios'

class GoogleSheetsService {
  constructor() {
    this.apiKey = localStorage.getItem('googleApiKey') || ''
    this.sheetId = localStorage.getItem('googleSheetId') || '1ReDbCa34AzTJSvO1-KPPADUok-eaEXEZufThw8yuBfA'
    this.groceryListRange = 'GroceryList!A:C'
    this.toBuyRange = 'ToBuy!A:B'
    
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

  // For public sheets, try multiple possible sheet names
  async getPublicSheetData(baseName) {
    const possibleNames = [baseName, 'Sheet1', 'Sheet 1', 'Groceries', 'List']
    
    for (const sheetName of possibleNames) {
      try {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
        const response = await axios.get(csvUrl, { timeout: 10000 })
        
        const csvData = response.data
        if (csvData && csvData.trim().length > 0) {
          const rows = this.parseCSV(csvData)
          if (rows.length > 0) {
            return rows.slice(1) // Skip header
          }
        }
      } catch (error) {
        console.warn(`Sheet "${sheetName}" not found, trying next...`)
        continue
      }
    }
    
    return [] // Return empty if no sheet found
  }

  parseCSV(csvText) {
    const lines = csvText.split('\n')
    const result = []
    
    for (let line of lines) {
      if (line.trim() === '') continue
      
      const row = []
      let currentField = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        const nextChar = line[i + 1]
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            currentField += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          row.push(currentField.trim())
          currentField = ''
        } else {
          currentField += char
        }
      }
      
      row.push(currentField.trim())
      result.push(row)
    }
    
    return result
  }

  async getGroceryList() {
    try {
      const rows = await this.getPublicSheetData('GroceryList')
      return rows.map((row, index) => ({
        id: index + 1,
        item: row[0] || '',
        category: row[1] || '',
        quantity: row[2] || ''
      }))
    } catch (error) {
      console.error('Error fetching grocery list:', error)
      // Return sample data if sheet fails
      return [
        { id: 1, item: 'Sample Item', category: 'Demo', quantity: '1' },
        { id: 2, item: 'Configure your Google Sheet', category: 'Settings', quantity: 'Required' }
      ]
    }
  }

  async getToBuyList() {
    try {
      const rows = await this.getPublicSheetData('ToBuy')
      return rows.map((row, index) => ({
        id: index + 1,
        item: row[0] || '',
        dateAdded: row[1] || new Date().toISOString().split('T')[0]
      }))
    } catch (error) {
      console.error('Error fetching to-buy list:', error)
      // Return sample data if sheet fails
      return [
        { id: 1, item: 'Sample Item to Buy', dateAdded: new Date().toISOString().split('T')[0] }
      ]
    }
  }

  async addItemToBuy(item) {
    if (!this.apiKey) {
      throw new Error('Adding items requires Google API key. Please configure in Settings.')
    }

    const dateAdded = new Date().toISOString().split('T')[0]
    
    try {
      const response = await axios.post(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/ToBuy!A:B:append?valueInputOption=RAW&key=${this.apiKey}`,
        {
          values: [[item, dateAdded]]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      return { success: true, item, dateAdded }
    } catch (error) {
      console.error('Error adding item to buy list:', error.response?.data || error.message)
      throw new Error(`Failed to add item: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  async addItemToGroceryList(item, category = '', quantity = '') {
    if (!this.apiKey) {
      throw new Error('Adding items requires Google API key. Please configure in Settings.')
    }

    try {
      const response = await axios.post(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/GroceryList!A:C:append?valueInputOption=RAW&key=${this.apiKey}`,
        {
          values: [[item, category, quantity]]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      return { success: true, item, category, quantity }
    } catch (error) {
      console.error('Error adding item to grocery list:', error.response?.data || error.message)
      throw new Error(`Failed to add item: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  isConfigured() {
    return !!(this.sheetId)
  }

  canWrite() {
    return !!(this.apiKey && this.sheetId)
  }
}

export default new GoogleSheetsService()
