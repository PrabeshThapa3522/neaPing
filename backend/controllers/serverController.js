import asyncHandler from 'express-async-handler';
import ping from 'ping';
import Server from '../models/serverModel.js';
import { checkServerStatus } from '../utils/statusChecker.js';

// @desc    Get all servers
// @route   GET /api/servers
// @access  Private
export const getServers = asyncHandler(async (req, res) => {
  const servers = await Server.find({});
  res.json(servers);
});

// @desc    Get servers by province
// @route   GET /api/servers/province/:provinceId
// @access  Private
export const getServersByProvince = asyncHandler(async (req, res) => {
  const { provinceId } = req.params;
  const servers = await Server.find({ provinceId });
  res.json(servers);
});

// @desc    Add new server
// @route   POST /api/servers
// @access  Private
export const addServer = asyncHandler(async (req, res) => {
  const { name, url, provinceId } = req.body;

  // Format URL properly if it's just a domain
  let formattedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
    formattedUrl = `http://${url}`;
  }

  const server = await Server.create({
    name,
    url: formattedUrl,
    provinceId,
    user: req.user._id,
  });

  // Check status immediately after creation
  const status = await checkServerStatus(formattedUrl);
  server.status = status.status;
  server.responseTime = status.responseTime;
  server.packetLoss = status.packetLoss;
  server.lastChecked = new Date();
  
  await server.save();

  res.status(201).json(server);
});

// @desc    Delete a server
// @route   DELETE /api/servers/:id
// @access  Private
export const deleteServer = asyncHandler(async (req, res) => {
  const server = await Server.findById(req.params.id);

  if (!server) {
    res.status(404);
    throw new Error('Server not found');
  }

  await server.deleteOne();
  res.json({ message: 'Server removed' });
});

// @desc    Refresh server status
// @route   POST /api/servers/:id/refresh
// @access  Private
export const refreshServerStatus = asyncHandler(async (req, res) => {
  const server = await Server.findById(req.params.id);

  if (!server) {
    res.status(404);
    throw new Error('Server not found');
  }

  const status = await checkServerStatus(server.url);
  
  server.status = status.status;
  server.responseTime = status.responseTime;
  server.packetLoss = status.packetLoss;
  server.lastChecked = new Date();
  
  await server.save();

  res.json(server);
});

// @desc    Refresh all servers in a province
// @route   POST /api/servers/refresh/province/:provinceId
// @access  Private
export const refreshProvinceServers = asyncHandler(async (req, res) => {
  const { provinceId } = req.params;
  const servers = await Server.find({ provinceId });

  const refreshPromises = servers.map(async (server) => {
    const status = await checkServerStatus(server.url);
    
    server.status = status.status;
    server.responseTime = status.responseTime;
    server.packetLoss = status.packetLoss;
    server.lastChecked = new Date();
    
    return server.save();
  });

  await Promise.all(refreshPromises);

  const updatedServers = await Server.find({ provinceId });
  res.json(updatedServers);
});