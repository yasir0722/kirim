<template>
  <div class="grocery-list">
    <div class="header-section">
      <h1 class="page-title">Grocery List</h1>
      <button @click="refreshList" class="refresh-btn" :disabled="loading">
        <svg class="refresh-icon" :class="{ spinning: loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
        </svg>
      </button>
    </div>

    <div v-if="error" class="error-message">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <p>{{ error }}</p>
      <button @click="refreshList" class="retry-btn">Try Again</button>
    </div>

    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading grocery list...</p>
    </div>

    <div v-else class="content">
      <div class="tabs">
        <button 
          @click="activeTab = 'grocery'" 
          class="tab-btn" 
          :class="{ active: activeTab === 'grocery' }"
        >
          Grocery List ({{ groceryItems.length }})
        </button>
        <button 
          @click="activeTab = 'tobuy'" 
          class="tab-btn" 
          :class="{ active: activeTab === 'tobuy' }"
        >
          To Buy ({{ toBuyItems.length }})
        </button>
      </div>

      <div v-if="activeTab === 'grocery'" class="items-list">
        <div v-if="groceryItems.length === 0" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <p>No items in your grocery list yet.</p>
        </div>
        
        <div v-for="item in groceryItems" :key="item.id" class="item-card">
          <div class="item-main">
            <h3 class="item-name">{{ item.item }}</h3>
            <div class="item-details">
              <span v-if="item.category" class="item-category">{{ item.category }}</span>
              <span v-if="item.quantity" class="item-quantity">{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'tobuy'" class="items-list">
        <div v-if="toBuyItems.length === 0" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5"/>
          </svg>
          <p>No items to buy yet.</p>
          <p class="read-only-note">This is a read-only view of your Google Sheet.</p>
        </div>
        
        <div v-for="item in toBuyItems" :key="item.id" class="item-card">
          <div class="item-main">
            <h3 class="item-name">{{ item.item }}</h3>
            <div class="item-details">
              <span class="item-date">Added: {{ formatDate(item.dateAdded) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import googleSheetsService from '../services/googleSheets.js'

export default {
  name: 'GroceryList',
  setup() {
    const groceryItems = ref([])
    const toBuyItems = ref([])
    const loading = ref(false)
    const error = ref('')
    const activeTab = ref('grocery')

    const isConfigured = computed(() => googleSheetsService.isConfigured())

    const loadData = async () => {
      loading.value = true
      error.value = ''

      try {
        const [groceryList, toBuyList] = await Promise.all([
          googleSheetsService.getGroceryList(),
          googleSheetsService.getToBuyList()
        ])

        groceryItems.value = groceryList
        toBuyItems.value = toBuyList
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const refreshList = () => {
      loadData()
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }

    onMounted(() => {
      loadData()
    })

    return {
      groceryItems,
      toBuyItems,
      loading,
      error,
      activeTab,
      isConfigured,
      refreshList,
      formatDate
    }
  }
}
</script>

<style scoped>
.grocery-list {
  padding: 20px 0;
}

.header-section {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  flex: 1;
}

.refresh-btn {
  background: #4ade80;
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #22c55e;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.error-message {
  background: #fef2f2;
  border: 1px solid #ef4444;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin: 0 auto 12px;
  stroke-width: 2;
}

.error-message p {
  color: #dc2626;
  margin-bottom: 16px;
}

.retry-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.retry-btn:hover {
  background: #dc2626;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.loading-state p {
  color: #64748b;
}

.tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
}

.tab-btn.active {
  background: white;
  color: #4ade80;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  stroke-width: 1.5;
  color: #cbd5e1;
}

.empty-state p {
  margin-bottom: 16px;
  font-size: 16px;
}

.read-only-note {
  font-size: 14px;
  color: #94a3b8 !important;
  font-style: italic;
  margin-bottom: 0 !important;
}

.add-item-btn {
  display: inline-block;
  background: #4ade80;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.add-item-btn:hover {
  background: #22c55e;
}

.item-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.item-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-main {
  flex: 1;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.item-details {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.item-category {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.item-quantity {
  background: #f3e8ff;
  color: #7c3aed;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.item-date {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 480px) {
  .grocery-list {
    padding: 16px 0;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .item-card {
    padding: 12px;
  }
  
  .item-name {
    font-size: 16px;
  }
}
</style>
