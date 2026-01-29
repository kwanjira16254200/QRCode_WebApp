import { Link2, FileText, Mail, Phone, MessageSquare, Wifi, User, MapPin, FileDown, Video, Image as ImageIcon, Facebook, Instagram } from 'lucide-react';

const qrTypes = [
  {
    id: 'url',
    name: 'Website',
    description: 'Link to any website',
    icon: Link2,
    color: 'blue',
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Share PDF document',
    icon: FileDown,
    color: 'red',
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Link to video content',
    icon: Video,
    color: 'purple',
  },
  {
    id: 'image',
    name: 'Image',
    description: 'Display image content',
    icon: ImageIcon,
    color: 'pink',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Link to Facebook profile or page',
    icon: Facebook,
    color: 'blue',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Link to Instagram profile',
    icon: Instagram,
    color: 'pink',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Send WhatsApp message',
    icon: MessageSquare,
    color: 'green',
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Plain text message',
    icon: FileText,
    color: 'gray',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send email with details',
    icon: Mail,
    color: 'red',
  },
  {
    id: 'phone',
    name: 'Phone Number',
    description: 'Call phone number',
    icon: Phone,
    color: 'green',
  },
  {
    id: 'wifi',
    name: 'WiFi',
    description: 'Connect to WiFi',
    icon: Wifi,
    color: 'indigo',
  },
  {
    id: 'location',
    name: 'Location',
    description: 'Share GPS location',
    icon: MapPin,
    color: 'orange',
  },
];

const TypeSelector = ({ onSelectType }) => {
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
              className="p-6 bg-white border-2 border-gray-200 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg hover:border-orange-500 hover:bg-orange-50"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-orange-50">
                  <Icon className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
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
