const mongoose = require('mongoose');

// Hero section
const heroSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  academicYear: { type: String },
  badgeText: { type: String },
}, { _id: false });

// Stats (campus stats cards shown on frontend)
const statSchema = new mongoose.Schema({
  icon: { type: String },
  count: { type: String },
  label: { type: String },
});

// Admission policy
const admissionPolicySchema = new mongoose.Schema({
  description: { type: String },
  minEligibility: { type: String },
  bscsCriteria: { type: String },
  otherCriteria: { type: String },
  registrationPolicy: { type: String },
  timeLimit: { type: String },
  attendancePolicy: { type: String },
}, { _id: false });

// Degree programs
const degreeProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['ADP', 'BS', 'Post-ADP'] },
  duration: { type: String },
});

// Fee structures (matches frontend data shape)
const feeStructureSchema = new mongoose.Schema({
  programName: { type: String, required: true },
  programType: { type: String, required: true, enum: ['BS', 'ADP', 'Post-ADP'] },
  creditHours: { type: Number },
  registration: { type: Number },
  admission: { type: Number },
  perCredit: { type: Number },
  total: { type: Number },
  yearlyAvg: { type: Number },
});

// Scholarships
const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String },
  eligibility: { type: String },
  percentage: { type: String },
  program: { type: String },
  description: { type: String },
});

// Features (simple strings stored as objects for flexibility)
const featureSchema = new mongoose.Schema({
  text: { type: String },
  title: { type: String },
  description: { type: String },
  icon: { type: String },
});

// Clubs
const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  image: { type: String },
  description: { type: String },
});

// Campus location details
const campusDetailsSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  mapEmbedUrl: { type: String },
}, { _id: false });

const campusInformationSchema = new mongoose.Schema({
  hero: { type: heroSchema, default: {} },
  stats: [statSchema],
  admissionPolicy: { type: admissionPolicySchema, default: {} },
  degreePrograms: [degreeProgramSchema],
  feeStructures: [feeStructureSchema],
  scholarships: [scholarshipSchema],
  features: [],
  clubs: [clubSchema],
  campusDetails: { type: campusDetailsSchema, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('CampusInformation', campusInformationSchema);
