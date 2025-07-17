<template>
  <div class="chat-float-box" ref="chatBox" v-show="visible">
    <div class="chat-header" @mousedown="startDrag">
      💬 DeepSeek 聊天助手
    </div>

    <div class="chat-body" v-show="expanded">
      <div class="ai-reply" v-html="renderedMarkdown"></div>

      <div class="ai-input">
        <textarea
          v-model="inputText"
          :disabled="isLoading"
          placeholder="请输入问题..."
          @keydown.enter.prevent="sendMessage"
        />
        <button class="submit" @click="sendMessage" :disabled="isLoading">发送</button>
        <button class="stop" @click="stopThinking" :disabled="!isLoading">停止</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import { marked } from 'marked'
import renderMathInElement from 'katex/contrib/auto-render'
import 'katex/dist/katex.min.css'

const inputText = ref('')
const isLoading = ref(false)
const renderedMarkdown = ref('')
const expanded = ref(true)
const visible = ref(true)
const chatBox = ref(null)

let ws = null

function toggleExpand() {
  expanded.value = !expanded.value
}

function stopThinking() {
  if (ws) {
    ws.close()
    ws = null
    isLoading.value = false
    renderedMarkdown.value += '<p style="color:gray;"><em>⏹️ 已停止思考。</em></p>'
  }
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  isLoading.value = true
  renderedMarkdown.value = '<p><em>正在思考中...</em></p>'

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

async function callDeepSeekAPI(question) {
  return new Promise(async (resolve, reject) => {
    const appId = 'f1cbd0ba'
    const apiKey = 'd3a9cd410e737695446786a33ecfa779'
    const apiSecret = 'Nzg3MDMwZDA0ZjA1Mzc4NzEwNDgwMWE4'
    const domain = 'general'
    const url = 'wss://spark-openapi.cn-huabei-1.xf-yun.com/v1/assistants/2nh9nigfqa2w_v1'

    const date = new Date().toUTCString()
    const crypto = await import('crypto-js')

    const signatureOrigin = `host: spark-openapi.cn-huabei-1.xf-yun.com\ndate: ${date}\nGET /v1/assistants/2nh9nigfqa2w_v1 HTTP/1.1`
    const signatureSha = crypto.HmacSHA256(signatureOrigin, apiSecret)
    const signature = crypto.enc.Base64.stringify(signatureSha)

    const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    const authorization = btoa(authorizationOrigin)

    const finalUrl = `${url}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=spark-openapi.cn-huabei-1.xf-yun.com`

    ws = new WebSocket(finalUrl)
    let resultText = ''

    ws.onopen = () => {
      const params = {
        header: { app_id: appId, uid: 'user_001' },
        parameter: {
          chat: { domain, temperature: 0.5, max_tokens: 1024 }
        },
        payload: {
          message: { text: [{ role: 'user', content: question }] }
        }
      }
      ws.send(JSON.stringify(params))
    }

    ws.onmessage = (event) => {
      const res = JSON.parse(event.data)
      if (res.header.code !== 0) {
        reject(new Error(`API错误: ${res.header.message}`))
        ws.close()
        return
      }

      const choices = res.payload.choices
      if (choices && choices.text?.length > 0) {
        const content = choices.text.map(c => c.content).join('')
        resultText += content
      }

      if (res.header.status === 2) {
        ws.close()
        resolve(resultText)
      }
    }

    ws.onerror = () => {
      reject(new Error('WebSocket 连接失败'))
    }

    ws.onclose = () => {
      if (!resultText) {
        reject(new Error('连接中断，未接收到内容'))
      }
    }
  })
}

onUpdated(() => {
  renderMathInElement(document.querySelector('.ai-reply'), {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ]
  })
})

// 拖动逻辑
onMounted(() => {
  const box = chatBox.value
  const header = box.querySelector('.chat-header')
  let isDragging = false
  let offsetX = 0
  let offsetY = 0

  header.addEventListener('mousedown', (e) => {
    isDragging = true
    const rect = box.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top
    document.body.style.userSelect = 'none'
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    let left = e.clientX - offsetX
    let top = e.clientY - offsetY

    const maxLeft = window.innerWidth - box.offsetWidth
    const maxTop = window.innerHeight - box.offsetHeight
    left = Math.max(0, Math.min(maxLeft, left))
    top = Math.max(0, Math.min(maxTop, top))

    box.style.left = `${left}px`
    box.style.top = `${top}px`
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
    document.body.style.userSelect = ''
  })
})
</script>

<style scoped>
.chat-float-box {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 320px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  font-family: Arial, sans-serif;
  cursor: move;
}

.chat-header {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  padding: 10px;
  font-weight: bold;
  cursor: grab;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.chat-body {
  padding: 10px;
}

.ai-reply {
  min-height: 100px;
  max-height: 150px;
  overflow-y: auto;
  font-size: 14px;
  border: 1px solid #eee;
  padding: 8px;
  border-radius: 6px;
  background: #fafafa;
  margin-bottom: 10px;
}

.ai-input {
  display: flex;
  gap: 5px;
}
textarea {
  flex: 1;
  height: 40px;
  resize: none;
  padding: 5px;
  font-size: 14px;
  border-radius: 6px;
}
.submit,
.stop {
  padding: 0 10px;
  background: #2575fc;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.submit:hover,
.stop:hover {
  background: #0056d2;
}
</style>
