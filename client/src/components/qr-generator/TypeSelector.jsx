import { Link2, FileText, Mail, Phone, MessageSquare, Wifi, User, MapPin } from 'lucide-react';

const qrTypes = [
  {
    id: 'url',
    name: 'URL/Website',
    description: 'Link to any website or webpage',
    icon: Link2,
    color: 'blue',
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Plain text message or information',
    icon: FileText,
    color: 'purple',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send email with pre-filled details',
    icon: Mail,
    color: 'red',
  },
  {
    id: 'phone',
    name: 'Phone Number',
    description: 'Call a phone number directly',
    icon: Phone,
    color: 'green',
  },
  {
    id: 'sms',
    name: 'SMS',
    description: 'Send SMS with pre-filled message',
    icon: MessageSquare,
    color: 'yellow',
  },
  {
    id: 'wifi',
    name: 'WiFi',
    description: 'Connect to WiFi network',
    icon: Wifi,
    color: 'indigo',
  },
  {
    id: 'vcard',
    name: 'vCard',
    description: 'Share contact information',
    icon: User,
    color: 'pink',
  },
  {
    id: 'location',
    name: 'Location',
    description: 'Share GPS coordinates or map link',
    icon: MapPin,
    color: 'orange',
  },
];

const TypeSelector = ({ onSelectType }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:border-purple-300',
      red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300',
      green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:border-green-300',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300',
      pink: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100 hover:border-pink-300',
      orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:border-orange-300',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose QR Code Type</h2>
        <p className="text-gray-600">Select the type of content you want to encode in your QR code</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {qrTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={`p-6 border-2 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg ${getColorClasses(
                type.color
              )}`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-white shadow-sm">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{type.name}</h3>
                  <p className="text-sm opacity-80">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TypeSelector;
