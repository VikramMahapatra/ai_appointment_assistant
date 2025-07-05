import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Settings
} from 'lucide-react';

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  description: string;
  price?: number;
  active: boolean;
}

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  active: boolean;
}

const serviceTypes: ServiceType[] = [
  {
    id: '1',
    name: 'Product Consultation',
    duration: 30,
    description: 'General product consultation and Q&A',
    price: 0,
    active: true
  },
  {
    id: '2',
    name: 'Technical Demo',
    duration: 60,
    description: 'Comprehensive technical demonstration',
    price: 0,
    active: true
  },
  {
    id: '3',
    name: 'Support Session',
    duration: 45,
    description: 'Technical support and troubleshooting',
    price: 0,
    active: true
  }
];

const timeSlots: TimeSlot[] = [
  { id: '1', day: 'Monday', startTime: '09:00', endTime: '17:00', active: true },
  { id: '2', day: 'Tuesday', startTime: '09:00', endTime: '17:00', active: true },
  { id: '3', day: 'Wednesday', startTime: '09:00', endTime: '17:00', active: true },
  { id: '4', day: 'Thursday', startTime: '09:00', endTime: '17:00', active: true },
  { id: '5', day: 'Friday', startTime: '09:00', endTime: '17:00', active: true },
  { id: '6', day: 'Saturday', startTime: '10:00', endTime: '14:00', active: false },
  { id: '7', day: 'Sunday', startTime: '10:00', endTime: '14:00', active: false }
];

export default function AppointmentSettings() {
  const [activeTab, setActiveTab] = useState('services');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [settings, setSettings] = useState({
    allowCancellation: true,
    cancellationWindow: 24,
    allowRescheduling: true,
    rescheduleWindow: 12,
    autoConfirmation: true,
    reminderNotifications: true,
    reminderTime: 60
  });

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
  };

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Service Types</h3>
        <button
          onClick={() => setShowServiceModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceTypes.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{service.name}</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setShowServiceModal(true);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{service.duration} min</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                service.active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {service.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="space-y-4">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={slot.active}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-medium text-gray-900">{slot.day}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={slot.startTime}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Appointment Settings</h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Allow Cancellation</h4>
              <p className="text-sm text-gray-600">Enable customers to cancel appointments</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowCancellation}
              onChange={(e) => setSettings({...settings, allowCancellation: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          {settings.allowCancellation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Window (hours before appointment)
              </label>
              <input
                type="number"
                value={settings.cancellationWindow}
                onChange={(e) => setSettings({...settings, cancellationWindow: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Allow Rescheduling</h4>
              <p className="text-sm text-gray-600">Enable customers to reschedule appointments</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowRescheduling}
              onChange={(e) => setSettings({...settings, allowRescheduling: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          {settings.allowRescheduling && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reschedule Window (hours before appointment)
              </label>
              <input
                type="number"
                value={settings.rescheduleWindow}
                onChange={(e) => setSettings({...settings, rescheduleWindow: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto Confirmation</h4>
              <p className="text-sm text-gray-600">Automatically confirm appointments</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoConfirmation}
              onChange={(e) => setSettings({...settings, autoConfirmation: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Reminder Notifications</h4>
              <p className="text-sm text-gray-600">Send appointment reminders</p>
            </div>
            <input
              type="checkbox"
              checked={settings.reminderNotifications}
              onChange={(e) => setSettings({...settings, reminderNotifications: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          {settings.reminderNotifications && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Time (minutes before appointment)
              </label>
              <input
                type="number"
                value={settings.reminderTime}
                onChange={(e) => setSettings({...settings, reminderTime: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Settings</h1>
        <p className="text-gray-600">Configure your appointment booking system</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'services', name: 'Service Types', icon: Calendar },
            { id: 'schedule', name: 'Schedule', icon: Clock },
            { id: 'settings', name: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'services' && renderServicesTab()}
        {activeTab === 'schedule' && renderScheduleTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service name"
                  defaultValue={editingService?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service description"
                  defaultValue={editingService?.description}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                  defaultValue={editingService?.duration}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setEditingService(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setEditingService(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingService ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}