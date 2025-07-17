<template>
  <div class="ai-wrapper">
    <div class="ai-header">DeepSeek 聊天</div>

    <div class="ai-content">
      <div class="ai-options">
        <button class="option-btn" @click="sendPreset('算法步骤')">算法步骤</button>
        <button class="option-btn" @click="sendPreset('算法代码')">算法代码</button>
        <button class="option-btn" @click="sendPreset('算法分析')">算法分析</button>
        <button class="option-btn" @click="sendPreset('算法流程图')">算法流程图</button>
      </div>

      <div class="ai-message-block">
        <div class="ai-avatar">
          <img src="/img/pic017.png" alt="Bot" class="avatar-img" />
          <span class="ai-time">{{ currentTime }}</span>
        </div>
        <div class="ai-reply" v-html="renderedMarkdown"></div>
      </div>

      <div class="ai-input">
        <textarea v-model="inputText" :disabled="isLoading" @keyup.enter="sendMessage" placeholder="请输入您要问的问题..." />
        <button class="submit" @click="sendMessage" :disabled="isLoading">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import { marked } from 'marked'
import renderMathInElement from "katex/contrib/auto-render"
import 'katex/dist/katex.min.css'

const inputText = ref('')
const isLoading = ref(false)
const renderedMarkdown = ref('')
const currentTime = ref(new Date().toLocaleString())

onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
})

onUpdated(() => {
  renderMathInElement(document.querySelector('.ai-reply'), {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false }
    ]
  })
})

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  isLoading.value = true
  renderedMarkdown.value = "<p><em>正在思考中...</em></p>"

  try {
    const reply = await callDeepSeekAPI(text)
    renderedMarkdown.value = marked(reply)
  } catch (err) {
    renderedMarkdown.value = `<span style="color:red;">请求失败：${err.message}</span>`
  } finally {
    isLoading.value = false
    inputText.value = ''
  }
}

async function sendPreset(type) {
  inputText.value = `请讲解一下${type}`
  await sendMessage()
}

async function callDeepSeekAPI(question) {
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions'
  const username = 'YOUR_USERNAME'
  const password = 'YOUR_PASSWORD'

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: question }],
      temperature: 0.7
    })
  })

  if (!response.ok) throw new Error('API请求失败：' + response.status)
  const data = await response.json()
  return data.choices[0]?.message?.content || '未返回内容'
}
</script>

<style scoped>
.ai-wrapper {
  width: 100%;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.ai-header {
  background: linear-gradient(to right, #a18cd1, cornflowerblue);
  color: white;
  padding: 10px;
  font-size: 20px;
  text-align: center;
  border-radius: 8px;
}

.ai-options {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  flex-wrap: wrap;
  gap: 10px;
}

.option-btn {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}
.option-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #2575fc, #6a11cb);
}

.ai-message-block {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
}

.ai-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}
.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.ai-time {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.ai-reply {
  flex: 1;
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  white-space: pre-wrap;
}

.ai-input {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

textarea {
  flex: 1;
  height: 80px;
  resize: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 15px;
}

.submit {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
.submit:hover {
  background: linear-gradient(135deg, #2575fc, #6a11cb);
}
</style>
