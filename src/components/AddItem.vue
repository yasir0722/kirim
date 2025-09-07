<template>
  <div class="add-item">
    <div class="header-section">
      <h1 class="page-title">Add Item</h1>
    </div>

    <div v-if="!isConfigured" class="config-notice">
      <div class="notice-content">
        <svg class="notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p><strong>Read-Only Mode</strong></p>
        <p>This app is connected to a public Google Sheet in read-only mode. You can view grocery lists but cannot add items.</p>
        <p>To enable adding items, you would need to set up your own Google Sheets API credentials.</p>
        <router-link to="/groceries" class="config-btn">Back to List</router-link>
      </div>
    </div>

    <div v-else class="content">
      <div class="form-section">
        <h2 class="section-title">Quick Add to Buy List</h2>
        <p class="section-description">Add items you need to buy on your way back</p>
        
        <form @submit.prevent="addToBuyList" class="add-form">
          <div class="input-group">
            <label for="toBuyItem" class="input-label">Item Name</label>
            <input
              id="toBuyItem"
              v-model="toBuyItem"
              type="text"
              class="input-field"
              placeholder="e.g., Milk, Bread, Apples..."
              required
              :disabled="loading"
            />
          </div>
          
          <button 
            type="submit" 
            class="submit-btn primary"
            :disabled="loading || !toBuyItem.trim()"
          >
            <svg v-if="loading" class="loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            {{ loading ? 'Adding...' : 'Add to Buy List' }}
          </button>
        </form>
      </div>

      <div class="divider">
        <span class="divider-text">OR</span>
      </div>

      <div class="form-section">
        <h2 class="section-title">Add to Grocery List</h2>
        <p class="section-description">Add items to your main grocery inventory</p>
        
        <form @submit.prevent="addToGroceryList" class="add-form">
          <div class="input-group">
            <label for="groceryItem" class="input-label">Item Name</label>
            <input
              id="groceryItem"
              v-model="groceryItem"
              type="text"
              class="input-field"
              placeholder="e.g., Tomatoes, Chicken breast..."
              required
              :disabled="loading"
            />
          </div>
          
          <div class="input-group">
            <label for="category" class="input-label">Category (Optional)</label>
            <select
              id="category"
              v-model="category"
              class="input-field"
              :disabled="loading"
            >
              <option value="">Select category...</option>
              <option value="Produce">Produce</option>
              <option value="Meat">Meat</option>
              <option value="Dairy">Dairy</option>
              <option value="Pantry">Pantry</option>
              <option value="Frozen">Frozen</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks">Snacks</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Household">Household</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="input-group">
            <label for="quantity" class="input-label">Quantity (Optional)</label>
            <input
              id="quantity"
              v-model="quantity"
              type="text"
              class="input-field"
              placeholder="e.g., 2 lbs, 1 dozen, 500g..."
              :disabled="loading"
            />
          </div>
          
          <button 
            type="submit" 
            class="submit-btn secondary"
            :disabled="loading || !groceryItem.trim()"
          >
            <svg v-if="loading" class="loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5"/>
            </svg>
            {{ loading ? 'Adding...' : 'Add to Grocery List' }}
          </button>
        </form>
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
import { ref, computed } from 'vue'
import googleSheetsService from '../services/googleSheets.js'

export default {
  name: 'AddItem',
  setup() {
    const toBuyItem = ref('')
    const groceryItem = ref('')
    const category = ref('')
    const quantity = ref('')
    const loading = ref(false)
    const message = ref('')
    const messageType = ref('')

    const isConfigured = computed(() => googleSheetsService.isConfigured())

    const showMessage = (text, type) => {
      message.value = text
      messageType.value = type
      setTimeout(() => {
        message.value = ''
        messageType.value = ''
      }, 3000)
    }

    const addToBuyList = async () => {
      if (!toBuyItem.value.trim()) return

      loading.value = true
      try {
        await googleSheetsService.addItemToBuy(toBuyItem.value.trim())
        showMessage(`"${toBuyItem.value}" added to your buy list!`, 'success')
        toBuyItem.value = ''
      } catch (error) {
        showMessage(error.message, 'error')
      } finally {
        loading.value = false
      }
    }

    const addToGroceryList = async () => {
      if (!groceryItem.value.trim()) return

      loading.value = true
      try {
        await googleSheetsService.addItemToGroceryList(
          groceryItem.value.trim(),
          category.value,
          quantity.value
        )
        showMessage(`"${groceryItem.value}" added to your grocery list!`, 'success')
        groceryItem.value = ''
        category.value = ''
        quantity.value = ''
      } catch (error) {
        showMessage(error.message, 'error')
      } finally {
        loading.value = false
      }
    }

    return {
      toBuyItem,
      groceryItem,
      category,
      quantity,
      loading,
      message,
      messageType,
      isConfigured,
      addToBuyList,
      addToGroceryList
    }
  }
}
</script>

<style scoped>
.add-item {
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

.config-notice {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.notice-content {
  text-align: center;
}

.notice-icon {
  width: 48px;
  height: 48px;
  color: #f59e0b;
  margin: 0 auto 12px;
  stroke-width: 2;
}

.notice-content p {
  color: #92400e;
  margin-bottom: 16px;
  line-height: 1.5;
}

.config-btn {
  display: inline-block;
  background: #f59e0b;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.config-btn:hover {
  background: #d97706;
}

.content {
  max-width: 480px;
  margin: 0 auto;
}

.form-section {
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
  line-height: 1.5;
}

.input-group {
  margin-bottom: 16px;
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

.input-field::placeholder {
  color: #9ca3af;
}

select.input-field {
  cursor: pointer;
}

select.input-field:disabled {
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
}

.submit-btn.primary {
  background: #4ade80;
  color: white;
}

.submit-btn.primary:hover:not(:disabled) {
  background: #22c55e;
  transform: translateY(-1px);
}

.submit-btn.secondary {
  background: #3b82f6;
  color: white;
}

.submit-btn.secondary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.loading-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.divider {
  text-align: center;
  margin: 32px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  background: #f8fafc;
  padding: 0 16px;
  color: #9ca3af;
  font-weight: 500;
  position: relative;
  z-index: 1;
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
  .add-item {
    padding: 16px 0;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .form-section {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .message {
    left: 16px;
    right: 16px;
    transform: none;
    max-width: none;
  }
}
</style>
