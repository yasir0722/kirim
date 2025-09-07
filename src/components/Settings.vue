<template>
  <div class="settings">
    <div class="header-section">
      <h1 class="page-title">Settings</h1>
    </div>

    <div class="content">
      <div class="settings-section">
        <h2 class="section-title">Google Sheets Configuration</h2>
        <p class="section-description">
          Connect your Google Sheets to sync your grocery lists. You'll need a Google API key and your sheet ID.
        </p>

        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="input-group">
            <label for="apiKey" class="input-label">Google API Key</label>
            <input
              id="apiKey"
              v-model="apiKey"
              type="text"
              class="input-field"
              placeholder="Enter your Google API key..."
              required
              :disabled="loading"
            />
            <p class="input-help">
              Get your API key from the 
              <a href="https://console.developers.google.com/" target="_blank" rel="noopener">Google Cloud Console</a>
            </p>
          </div>

          <div class="input-group">
            <label for="sheetId" class="input-label">Google Sheet ID</label>
            <input
              id="sheetId"
              v-model="sheetId"
              type="text"
              class="input-field"
              placeholder="Enter your Google Sheet ID..."
              required
              :disabled="loading"
            />
            <p class="input-help">
              Found in your Google Sheets URL: docs.google.com/spreadsheets/d/<strong>SHEET_ID</strong>/edit
            </p>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading || !apiKey.trim() || !sheetId.trim()"
          >
            <svg v-if="loading" class="loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            {{ loading ? 'Saving...' : 'Save Settings' }}
          </button>
        </form>

        <div v-if="isConfigured" class="status-section">
          <div class="status-indicator success">
            <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <span>Google Sheets Connected</span>
          </div>
          <button @click="testConnection" class="test-btn" :disabled="testing">
            <svg v-if="testing" class="loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            {{ testing ? 'Testing...' : 'Test Connection' }}
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">Sheet Setup Instructions</h2>
        <div class="instructions">
          <div class="instruction-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Create a Google Sheet</h3>
              <p>Create a new Google Sheets document with two tabs:</p>
              <ul>
                <li><strong>GroceryList</strong> - with columns: Item, Category, Quantity</li>
                <li><strong>ToBuy</strong> - with columns: Item, DateAdded</li>
              </ul>
            </div>
          </div>

          <div class="instruction-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Make it Public</h3>
              <p>Share your sheet with "Anyone with the link can view" permissions.</p>
            </div>
          </div>

          <div class="instruction-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Get API Key</h3>
              <p>Enable the Google Sheets API and create an API key in the Google Cloud Console.</p>
            </div>
          </div>

          <div class="instruction-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Configure Above</h3>
              <p>Enter your API key and Sheet ID in the form above.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">About</h2>
        <div class="about-content">
          <p><strong>Grocery Tracker</strong> v1.0.0</p>
          <p>A mobile-friendly grocery list manager with Google Sheets integration.</p>
          <div class="about-links">
            <a href="#" class="about-link">
              <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Help & Support
            </a>
            <a href="#" class="about-link">
              <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              Source Code
            </a>
          </div>
        </div>
      </div>

      <div v-if="message" class="message" :class="messageType">
        <svg v-if="messageType === 'success'" class="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        <svg v-else class="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import googleSheetsService from '../services/googleSheets.js'

export default {
  name: 'Settings',
  setup() {
    const apiKey = ref('')
    const sheetId = ref('')
    const loading = ref(false)
    const testing = ref(false)
    const message = ref('')
    const messageType = ref('')

    const isConfigured = computed(() => googleSheetsService.isConfigured())

    const showMessage = (text, type) => {
      message.value = text
      messageType.value = type
      setTimeout(() => {
        message.value = ''
        messageType.value = ''
      }, 4000)
    }

    const loadCurrentSettings = () => {
      const credentials = googleSheetsService.getCredentials()
      apiKey.value = credentials.apiKey
      sheetId.value = credentials.sheetId
    }

    const saveSettings = async () => {
      loading.value = true
      try {
        googleSheetsService.setCredentials(apiKey.value.trim(), sheetId.value.trim())
        showMessage('Settings saved successfully!', 'success')
      } catch (error) {
        showMessage('Failed to save settings.', 'error')
      } finally {
        loading.value = false
      }
    }

    const testConnection = async () => {
      testing.value = true
      try {
        await googleSheetsService.getGroceryList()
        showMessage('Connection successful! Your Google Sheets is working correctly.', 'success')
      } catch (error) {
        showMessage(`Connection failed: ${error.message}`, 'error')
      } finally {
        testing.value = false
      }
    }

    onMounted(() => {
      loadCurrentSettings()
    })

    return {
      apiKey,
      sheetId,
      loading,
      testing,
      message,
      messageType,
      isConfigured,
      saveSettings,
      testConnection
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 20px 0;
}

.header-section {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.content {
  max-width: 600px;
  margin: 0 auto;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.section-description {
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
}

.settings-form {
  space-y: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
}

.input-field:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.input-field:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.input-help {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.input-help a {
  color: #4ade80;
  text-decoration: none;
  font-weight: 500;
}

.input-help a:hover {
  text-decoration: underline;
}

.submit-btn, .test-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn {
  width: 100%;
  background: #4ade80;
  color: white;
  margin-top: 20px;
}

.submit-btn:hover:not(:disabled) {
  background: #22c55e;
  transform: translateY(-1px);
}

.test-btn {
  background: #3b82f6;
  color: white;
  margin-left: auto;
}

.test-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled, .test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.loading-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.status-indicator.success {
  background: #dcfce7;
  color: #16a34a;
}

.status-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.instructions {
  space-y: 20px;
}

.instruction-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #4ade80;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.step-content p {
  color: #64748b;
  margin-bottom: 8px;
  line-height: 1.5;
}

.step-content ul {
  margin-left: 16px;
  color: #64748b;
}

.step-content li {
  margin-bottom: 4px;
  line-height: 1.5;
}

.about-content p {
  color: #64748b;
  margin-bottom: 8px;
  line-height: 1.5;
}

.about-links {
  margin-top: 16px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.about-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4ade80;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.about-link:hover {
  color: #22c55e;
}

.link-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  animation: slideIn 0.3s ease-out;
}

.message.success {
  background: #dcfce7;
  border: 1px solid #22c55e;
  color: #16a34a;
}

.message.error {
  background: #fef2f2;
  border: 1px solid #ef4444;
  color: #dc2626;
}

.message-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  flex-shrink: 0;
}

.message p {
  margin: 0;
  font-weight: 500;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 480px) {
  .settings {
    padding: 16px 0;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .settings-section {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .status-section {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .message {
    left: 16px;
    right: 16px;
    transform: none;
    max-width: none;
  }
  
  .about-links {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
