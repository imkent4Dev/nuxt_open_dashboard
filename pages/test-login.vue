<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-6">Login API Test</h1>
      
      <!-- Test Form -->
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-2">Username or Email</label>
          <input 
            v-model="testCredentials.usernameOrEmail" 
            type="text"
            class="w-full px-4 py-2 border rounded-lg"
            placeholder="admin"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <input 
            v-model="testCredentials.password" 
            type="password"
            class="w-full px-4 py-2 border rounded-lg"
            placeholder="Admin123@!"
          />
        </div>
        
        <button 
          @click="testDirectFetch"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Test Direct Fetch
        </button>
        
        <button 
          @click="testWithProxy"
          class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Test With Proxy
        </button>
        
        <button 
          @click="testDirectToBackend"
          class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          Test Direct to Backend (CORS expected)
        </button>
      </div>
      
      <!-- Results -->
      <div class="space-y-4">
        <div v-if="loading" class="text-blue-600">Loading...</div>
        
        <div v-if="result" class="bg-gray-50 p-4 rounded">
          <h3 class="font-bold mb-2">Result:</h3>
          <pre class="text-xs overflow-auto">{{ JSON.stringify(result, null, 2) }}</pre>
        </div>
        
        <div v-if="error" class="bg-red-50 border border-red-200 p-4 rounded">
          <h3 class="font-bold text-red-600 mb-2">Error:</h3>
          <pre class="text-xs overflow-auto text-red-600">{{ error }}</pre>
        </div>
      </div>
      
      <!-- Payload Preview -->
      <div class="mt-6 bg-yellow-50 p-4 rounded">
        <h3 class="font-bold mb-2">Payload that will be sent:</h3>
        <pre class="text-xs">{{ JSON.stringify({
          usernameOrEmail: testCredentials.usernameOrEmail,
          password: testCredentials.password
        }, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const testCredentials = ref({
  usernameOrEmail: 'admin',
  password: 'Admin123@!'
})

const loading = ref(false)
const result = ref(null)
const error = ref(null)

const testDirectFetch = async () => {
  loading.value = true
  result.value = null
  error.value = null
  
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usernameOrEmail: testCredentials.value.usernameOrEmail,
        password: testCredentials.value.password
      })
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const data = await response.json()
    console.log('Response data:', data)
    
    result.value = {
      status: response.status,
      statusText: response.statusText,
      data: data
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const testWithProxy = async () => {
  loading.value = true
  result.value = null
  error.value = null
  
  try {
    const response = await $fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: {
        usernameOrEmail: testCredentials.value.usernameOrEmail,
        password: testCredentials.value.password
      }
    })
    
    console.log('Response:', response)
    result.value = response
  } catch (err) {
    console.error('Error:', err)
    error.value = JSON.stringify(err, null, 2)
  } finally {
    loading.value = false
  }
}

const testDirectToBackend = async () => {
  loading.value = true
  result.value = null
  error.value = null
  
  try {
    const response = await fetch('http://localhost:8081/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usernameOrEmail: testCredentials.value.usernameOrEmail,
        password: testCredentials.value.password
      })
    })
    
    const data = await response.json()
    result.value = {
      status: response.status,
      statusText: response.statusText,
      data: data
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = 'CORS Error (expected): ' + err.message
  } finally {
    loading.value = false
  }
}
</script>