# Healthcare Platform

A modern, full-stack healthcare management platform that connects patients with healthcare providers. Built with React (TypeScript) frontend and Django REST API backend.

## 🌟 Features

### For Patients
- **User Registration & Authentication** - Secure account creation and login
- **Appointment Management** - View appointment history and schedule new appointments
- **Medication Tracking** - Track prescribed medications with reminders and completion status
- **Health Analytics** - Interactive charts showing blood pressure trends and health metrics
- **Doctor Communication** - Receive advice and instructions from healthcare providers
- **Progress Reports** - Upload and manage health progress reports
- **Responsive Dashboard** - Mobile-friendly interface for all devices

### For Doctors
- **Patient Management** - Comprehensive dashboard to manage assigned patients
- **Appointment Scheduling** - Schedule and manage patient appointments
- **Medical Advice** - Provide medical advice and treatment recommendations
- **Patient Analytics** - View patient health trends and medical history
- **Report Management** - Review patient-uploaded reports and documents
- **Professional Dashboard** - Specialized interface for healthcare providers

### Security & Compliance
- **JWT Authentication** - Secure token-based authentication
- **HIPAA-Compliant Design** - Privacy-focused architecture
- **Role-Based Access** - Separate interfaces for patients and doctors
- **Data Encryption** - Secure data transmission and storage

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Django 5.2** with Python
- **Django REST Framework** for API
- **JWT Authentication** with SimpleJWT
- **SQLite** database (development)
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Python** (v3.8 or higher)
- **pip** (Python package manager)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd healthcare-platform
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create sample data (optional but recommended)
python manage.py create_sample_data

# Create superuser (optional)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration

The backend uses environment variables for configuration. Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:8000`. If you need to change this, update the `API_BASE_URL` in `frontend/src/services/api.ts`.

## 👥 Sample Data

The application includes a management command to create sample data for testing:

```bash
cd backend
python manage.py create_sample_data
```

This creates:
- **3 Sample Doctors** with different specializations
- **4 Sample Patients** with various medical conditions
- **Sample Appointments** (past and future)
- **Sample Medications** with different statuses
- **Sample Health Metrics** (blood pressure readings)
- **Sample Medical Advice** from doctors
- **Sample Progress Reports**

### Sample Login Credentials

After running the sample data command, you can login with:

**Doctors:**
- `sarah.wilson@hospital.com` / `password123` (General Medicine)
- `michael.chen@hospital.com` / `password123` (Cardiology)
- `emily.johnson@hospital.com` / `password123` (Pediatrics)

**Patients:**
- `john.doe@email.com` / `password123`
- `jane.smith@email.com` / `password123`
- `david.brown@email.com` / `password123`
- `lisa.davis@email.com` / `password123`

## 📱 Usage

### For New Users

1. **Registration:**
   - Visit the application homepage
   - Click "Get Started" or "Sign Up"
   - Choose "Patient" or "Doctor"
   - Fill in the required information
   - Submit the form to create your account

2. **Login:**
   - Click "Sign In" on the homepage
   - Select your user type (Patient/Doctor)
   - Enter your email and password
   - Access your personalized dashboard

### Patient Workflow

1. **Dashboard Overview** - View your health summary and quick actions
2. **Appointments** - Check upcoming appointments and history
3. **Medications** - Track your prescribed medications
4. **Doctor Advice** - Read medical advice from your healthcare provider
5. **Reports** - Upload progress reports and medical documents
6. **Health Analytics** - Monitor your health trends with interactive charts

### Doctor Workflow

1. **Overview** - View patient statistics and quick actions
2. **New Patients** - Review and schedule appointments for newly assigned patients
3. **Existing Patients** - Manage ongoing patient care and provide medical advice
4. **Patient Analytics** - Review patient health data and trends

## 🔍 API Documentation

### Authentication Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/doctors/` - List all doctors (for patient registration)

### Patient Endpoints

- `GET /api/patients/` - List all patients
- `GET /api/patients/{id}/` - Get patient details

### Doctor Endpoints

- `GET /api/doctors/` - List all doctors
- `GET /api/doctors/{id}/` - Get doctor details
- `GET /api/doctors/{id}/patients/` - Get doctor's patients

### Appointment Endpoints

- `GET /api/appointments/patient/{id}/` - Get patient appointments
- `POST /api/appointments/create/` - Create new appointment
- `GET /api/appointments/medications/patient/{id}/` - Get patient medications
- `PUT /api/appointments/medications/{id}/status/` - Update medication status
- `GET /api/appointments/advice/patient/{id}/` - Get patient advice
- `POST /api/appointments/advice/create/` - Create medical advice
- `GET /api/appointments/health-metrics/patient/{id}/` - Get health metrics
- `GET /api/appointments/reports/patient/{id}/` - Get patient reports
- `POST /api/appointments/reports/create/` - Create patient report

## 🧪 Testing

### Backend Testing

```bash
cd backend
python manage.py test
```

### Frontend Testing

```bash
cd frontend
npm run test
```

## 🏗️ Project Structure

```
healthcare-platform/
├── backend/
│   ├── healthcare_platform/     # Django project settings
│   ├── authentication/          # User authentication app
│   ├── patients/               # Patient management app
│   ├── doctors/                # Doctor management app
│   ├── appointments/           # Appointments and medical data app
│   ├── requirements.txt        # Python dependencies
│   └── manage.py              # Django management script
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── patient/      # Patient dashboard components
│   │   │   ├── doctor/       # Doctor dashboard components
│   │   │   ├── layout/       # Layout components
│   │   │   └── ui/           # Reusable UI components
│   │   ├── services/         # API service functions
│   │   ├── utils/            # Utility functions
│   │   ├── types/            # TypeScript type definitions
│   │   └── routes/           # Route configurations
│   ├── package.json          # Node.js dependencies
│   └── vite.config.ts        # Vite configuration
└── README.md                 # This file
```

## 🚀 Deployment

### Backend Deployment

1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables for production
3. Set `DEBUG=False` in settings
4. Configure allowed hosts
5. Use a production WSGI server like Gunicorn
6. Set up static file serving

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service
3. Configure the API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Review the troubleshooting section below
3. Create a new issue with detailed information

## 🔧 Troubleshooting

### Common Issues

**1. Backend won't start:**
- Ensure Python virtual environment is activated
- Check if all dependencies are installed: `pip install -r requirements.txt`
- Run migrations: `python manage.py migrate`

**2. Frontend won't start:**
- Ensure Node.js is installed (v16+)
- Delete `node_modules` and run `npm install` again
- Check if port 5173 is available

**3. Authentication issues:**
- Clear browser localStorage
- Restart both frontend and backend servers
- Check if CORS is properly configured

**4. Database issues:**
- Delete `db.sqlite3` and run migrations again
- Recreate sample data: `python manage.py create_sample_data`

**5. API connection issues:**
- Verify backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Ensure API_BASE_URL is correctly configured

### Development Tips

- Use browser developer tools to debug API requests
- Check Django logs for backend errors
- Use React Developer Tools for frontend debugging
- Monitor network tab for API response issues

## 📊 Features Roadmap

- [ ] Real-time notifications
- [ ] Video consultation integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Insurance integration
- [ ] Prescription management
- [ ] Lab results integration

---

**Built with ❤️ for better healthcare management**