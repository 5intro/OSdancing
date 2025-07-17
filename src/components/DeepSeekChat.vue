<template>
  <div class="chat-float-box" v-show="visible">
    <div class="chat-header" @click="toggleExpand">
      💬 DeepSeek 聊天助手
    </div>

    <div class="chat-body" v-show="expanded">
      <div class="ai-options">
        <button class="option-btn" @click="sendPreset('算法步骤')">算法步骤</button>
        <button class="option-btn" @click="sendPreset('算法代码')">算法代码</button>
        <button class="option-btn" @click="sendPreset('算法分析')">算法分析</button>
        <button class="option-btn" @click="sendPreset('算法流程图')">算法流程图</button>
      </div>

      <div class="ai-reply" v-html="renderedMarkdown"></div>

      <div class="ai-input">
        <textarea v-model="inputText" :disabled="isLoading" placeholder="请输入问题..." />
        <button class="submit" @click="sendMessage" :disabled="isLoading">
          发送
        </button>
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

function toggleExpand() {
  expanded.value = !expanded.value
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

async function sendPreset(type) {
  inputText.value = `请讲解一下${type}`
  await sendMessage()
}

async function callDeepSeekAPI(question) {
  return new Promise(async (resolve, reject) => {
    const appId = 'f1cbd0ba'
    const apiKey = 'd3a9cd410e737695446786a33ecfa779'
    const apiSecret = 'Nzg3MDMwZDA0ZjA1Mzc4NzEwNDgwMWE4'
    const domain = 'general' // 一般是 general 或 generalv2
    const url = 'wss://spark-openapi.cn-huabei-1.xf-yun.com/v1/assistants/2nh9nigfqa2w_v1'

    // 生成时间戳与签名
    const date = new Date().toUTCString()
    const crypto = await import('crypto-js')

    const signatureOrigin = `host: spark-openapi.cn-huabei-1.xf-yun.com\ndate: ${date}\nGET /v1/assistants/2nh9nigfqa2w_v1 HTTP/1.1`
    const signatureSha = crypto.HmacSHA256(signatureOrigin, apiSecret)
    const signature = crypto.enc.Base64.stringify(signatureSha)

    const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    const authorization = btoa(authorizationOrigin)

    const finalUrl = `${url}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=spark-openapi.cn-huabei-1.xf-yun.com`

    let ws
    let resultText = ''

    try {
      ws = new WebSocket(finalUrl)

      ws.onopen = () => {
        const params = {
          header: {
            app_id: appId,
            uid: 'user_001'
          },
          parameter: {
            chat: {
              domain: domain,
              temperature: 0.5,
              max_tokens: 1024
            }
          },
          payload: {
            message: {
              text: [{ role: 'user', content: question }]
            }
          }
        }
        ws.send(JSON.stringify(params))
      }

      ws.onmessage = (event) => {
        const res = JSON.parse(event.data)
        if (res.header.code !== 0) {
          reject(new Error(`API返回错误: ${res.header.message}`))
          ws.close()
          return
        }

        const choices = res.payload.choices
        if (choices && choices.text && choices.text.length > 0) {
          const content = choices.text.map((c) => c.content).join('')
          resultText += content
        }

        if (res.header.status === 2) {
          ws.close()
          resolve(resultText)
        }
      }

      ws.onerror = (err) => {
        reject(new Error('WebSocket 连接失败'))
      }

      ws.onclose = () => {
        if (!resultText) {
          reject(new Error('WebSocket 提前关闭，未接收到内容'))
        }
      }
    } catch (e) {
      reject(new Error('连接异常: ' + e.message))
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
}

.chat-header {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.chat-body {
  padding: 10px;
}

.ai-options {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.option-btn {
  background: #eee;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
}
.option-btn:hover {
  background: #ddd;
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
.submit {
  padding: 0 10px;
  background: #2575fc;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.submit:hover {
  background: #0056d2;
}
</style>
