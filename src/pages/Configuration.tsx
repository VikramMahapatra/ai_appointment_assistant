import React, { useState } from 'react';
import { 
  Settings, 
  MessageSquare, 
  Phone, 
  Send, 
  Key, 
  CheckCircle,
  AlertCircle,
  Save,
  Calendar as CalendarIcon
} from 'lucide-react';

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const configSections: ConfigSection[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Integration',
    description: 'Configure Twilio WhatsApp Business API',
    icon: Phone
  },
  {
    id: 'telegram',
    title: 'Telegram Integration',
    description: 'Setup Telegram Bot API',
    icon: Send
  },
  {
    id: 'assistant',
    title: 'AI Assistant Settings',
    description: 'Configure LLM and response behavior',
    icon: MessageSquare
  },
  {
    id: 'google_calendar',
    title: 'Google Calendar Integration',
    description: 'Connect and sync with Google Calendar',
    icon: CalendarIcon
  }
];

export default function Configuration() {
  const [activeSection, setActiveSection] = useState('whatsapp');
  const [configurations, setConfigurations] = useState({
    whatsapp: {
      accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      authToken: '',
      phoneNumber: '+1234567890',
      webhookUrl: 'https://api.example.com/whatsapp/webhook',
      enabled: true
    },
    telegram: {
      botToken: '',
      webhookUrl: 'https://api.example.com/telegram/webhook',
      enabled: false
    },
    assistant: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'You are a helpful AI assistant for appointment booking and customer service.',
      enabled: true
    },
    google_calendar: {
      clientId: '',
      clientSecret: '',
      connected: false
    }
  });
  const [googleTokenFile, setGoogleTokenFile] = useState<File | null>(null);
  const [googleTokenFileName, setGoogleTokenFileName] = useState<string>('');

  const handleSave = () => {
    // Save configurations
    console.log('Saving configurations:', configurations);
  };

  const renderWhatsAppConfig = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">WhatsApp Integration Active</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Your WhatsApp Business API is configured and receiving messages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twilio Account SID
          </label>
          <input
            type="text"
            value={configurations.whatsapp.accountSid}
            onChange={(e) => setConfigurations({
              ...configurations,
              whatsapp: { ...configurations.whatsapp, accountSid: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Twilio Account SID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auth Token
          </label>
          <input
            type="password"
            value={configurations.whatsapp.authToken}
            onChange={(e) => setConfigurations({
              ...configurations,
              whatsapp: { ...configurations.whatsapp, authToken: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Auth Token"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={configurations.whatsapp.phoneNumber}
            onChange={(e) => setConfigurations({
              ...configurations,
              whatsapp: { ...configurations.whatsapp, phoneNumber: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter WhatsApp Business Phone Number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <input
            type="url"
            value={configurations.whatsapp.webhookUrl}
            onChange={(e) => setConfigurations({
              ...configurations,
              whatsapp: { ...configurations.whatsapp, webhookUrl: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Webhook URL"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Setup Instructions</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Create a Twilio account and obtain your Account SID and Auth Token</li>
          <li>2. Set up WhatsApp Business API sandbox or production account</li>
          <li>3. Configure the webhook URL in your Twilio console</li>
          <li>4. Test the connection by sending a message to your WhatsApp number</li>
        </ol>
      </div>
    </div>
  );

  const renderTelegramConfig = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Telegram Integration Not Active</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Configure your Telegram Bot Token to enable integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bot Token
          </label>
          <input
            type="password"
            value={configurations.telegram.botToken}
            onChange={(e) => setConfigurations({
              ...configurations,
              telegram: { ...configurations.telegram, botToken: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Telegram Bot Token"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <input
            type="url"
            value={configurations.telegram.webhookUrl}
            onChange={(e) => setConfigurations({
              ...configurations,
              telegram: { ...configurations.telegram, webhookUrl: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Webhook URL"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Setup Instructions</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Create a new bot by messaging @BotFather on Telegram</li>
          <li>2. Use the /newbot command and follow the instructions</li>
          <li>3. Copy the bot token provided by BotFather</li>
          <li>4. Set up your webhook URL to receive messages</li>
        </ol>
      </div>
    </div>
  );

  const renderAssistantConfig = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">AI Assistant Active</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Your AI assistant is configured and ready to respond to customer queries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LLM Provider
          </label>
          <select
            value={configurations.assistant.provider}
            onChange={(e) => setConfigurations({
              ...configurations,
              assistant: { ...configurations.assistant, provider: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="groq">Groq</option>
            <option value="llama">Llama</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <select
            value={configurations.assistant.model}
            onChange={(e) => setConfigurations({
              ...configurations,
              assistant: { ...configurations.assistant, model: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature ({configurations.assistant.temperature})
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={configurations.assistant.temperature}
            onChange={(e) => setConfigurations({
              ...configurations,
              assistant: { ...configurations.assistant, temperature: parseFloat(e.target.value) }
            })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Tokens
          </label>
          <input
            type="number"
            value={configurations.assistant.maxTokens}
            onChange={(e) => setConfigurations({
              ...configurations,
              assistant: { ...configurations.assistant, maxTokens: parseInt(e.target.value) }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter max tokens"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <textarea
          value={configurations.assistant.systemPrompt}
          onChange={(e) => setConfigurations({
            ...configurations,
            assistant: { ...configurations.assistant, systemPrompt: e.target.value }
          })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter system prompt for the AI assistant"
        />
      </div>
    </div>
  );

  const renderGoogleCalendarConfig = () => (
    <div className="space-y-6">
      <div className={`bg-${configurations.google_calendar.connected ? 'green' : 'yellow'}-50 border border-${configurations.google_calendar.connected ? 'green' : 'yellow'}-200 rounded-lg p-4`}>
        <div className="flex items-center space-x-2">
          <CheckCircle className={`h-5 w-5 text-${configurations.google_calendar.connected ? 'green' : 'yellow'}-600`} />
          <span className={`text-sm font-medium text-${configurations.google_calendar.connected ? 'green' : 'yellow'}-800`}>
            {configurations.google_calendar.connected ? 'Google Calendar Connected' : 'Google Calendar Not Connected'}
          </span>
        </div>
        <p className={`text-sm text-${configurations.google_calendar.connected ? 'green' : 'yellow'}-700 mt-1`}>
          {configurations.google_calendar.connected
            ? 'Your Google Calendar is connected and ready to sync appointments.'
            : 'Connect your Google account to enable calendar sync.'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">OAuth Client ID</label>
          <input
            type="text"
            value={configurations.google_calendar.clientId}
            onChange={e => setConfigurations({
              ...configurations,
              google_calendar: { ...configurations.google_calendar, clientId: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Google OAuth Client ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">OAuth Client Secret</label>
          <input
            type="password"
            value={configurations.google_calendar.clientSecret}
            onChange={e => setConfigurations({
              ...configurations,
              google_calendar: { ...configurations.google_calendar, clientSecret: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Google OAuth Client Secret"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Google Calendar JSON Token</label>
        <input
          type="file"
          accept="application/json"
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              setGoogleTokenFile(e.target.files[0]);
              setGoogleTokenFileName(e.target.files[0].name);
            } else {
              setGoogleTokenFile(null);
              setGoogleTokenFileName('');
            }
          }}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {googleTokenFileName && (
          <div className="mt-2 text-sm text-green-700">Selected: {googleTokenFileName}</div>
        )}
      </div>
      <div className="flex items-center space-x-3 mt-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setConfigurations({
            ...configurations,
            google_calendar: { ...configurations.google_calendar, connected: !configurations.google_calendar.connected }
          })}
        >
          {configurations.google_calendar.connected ? 'Disconnect' : 'Connect to Google'}
        </button>
        {configurations.google_calendar.connected && (
          <span className="text-green-600 text-sm font-medium">Connected</span>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <h4 className="font-medium text-gray-900 mb-2">Setup Instructions</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Go to Google Cloud Console and create a new OAuth 2.0 Client ID.</li>
          <li>2. Add your redirect URI and download the credentials.</li>
          <li>3. Enter the Client ID and Secret above.</li>
          <li>4. Upload the downloaded JSON token file here.</li>
          <li>5. Click Connect to Google and complete the authentication flow.</li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
        <p className="text-gray-600">Configure your messaging integrations and AI assistant settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Settings</h3>
            </div>
            <nav className="p-2">
              {configSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg mb-1 text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Configuration Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {configSections.find(s => s.id === activeSection)?.title}
              </h3>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
            <div className="p-6">
              {activeSection === 'whatsapp' && renderWhatsAppConfig()}
              {activeSection === 'telegram' && renderTelegramConfig()}
              {activeSection === 'assistant' && renderAssistantConfig()}
              {activeSection === 'google_calendar' && renderGoogleCalendarConfig()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}