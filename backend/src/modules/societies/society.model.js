const mongoose = require('mongoose');
const slugify = require('slugify');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, default: '', trim: true },
  designation: { type: String, default: '', trim: true },
  image: { type: String, default: '' },
  linkedin: { type: String, default: '', trim: true },
  github: { type: String, default: '', trim: true },
  skills: [{ type: String, trim: true }],
});

const societySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, index: true, unique: true },
  tagline: { type: String, default: '', trim: true },
  tag: { type: String, default: '', trim: true },      // NEW
  icon: { type: String, default: '' },                 // NEW
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  mission: { type: String, default: '' },
  vision: { type: String, default: '' },
  motto: { type: String, default: '' },
  objectives: [{ type: String }],
  activities: [{ type: String }],
  contact: {
    email: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    office: { type: String, default: '', trim: true },
  },
  team: [teamMemberSchema],
  teamMembers: [teamMemberSchema],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

societySchema.pre('save', function() {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

module.exports = mongoose.model('Society', societySchema);