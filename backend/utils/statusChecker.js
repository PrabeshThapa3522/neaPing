import ping from 'ping';
import http from 'http';
import https from 'https';

export const checkServerStatus = async (url) => {
  // Handle IP addresses or hostnames for ping
  const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url);
  const host = isIp ? url : url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
  
  try {
    // First try ping
    const pingResult = await ping.promise.probe(host, {
      timeout: 5,
      extra: ['-c', '4'],
    });

    // Check HTTP(S) status if not an IP address
    let httpStatus = null;
    let responseTime = null;

    if (!isIp) {
      try {
        const startTime = Date.now();
        const result = await checkHttpStatus(url);
        responseTime = Date.now() - startTime;
        httpStatus = result;
      } catch (error) {
        httpStatus = false;
      }
    }

    // Determine overall status
    let status = 'offline';
    if (pingResult.alive && (isIp || httpStatus)) {
      status = 'online';
    } else if (pingResult.alive && !httpStatus) {
      status = 'issues';
    }

    // Calculate packet loss percentage
    const packetLoss = parseFloat(pingResult.packetLoss) || 0;

    return {
      status,
      responseTime: responseTime || null,
      packetLoss,
    };
  } catch (error) {
    console.error('Error checking server status:', error);
    return {
      status: 'offline',
      responseTime: null,
      packetLoss: 100,
    };
  }
};

const checkHttpStatus = (url) => {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    const timeoutMs = 5000; // 5 second timeout
    
    const req = client.get(url, (res) => {
      const statusCode = res.statusCode;
      
      // Immediately close response stream - we don't need the data
      res.resume();
      
      if (statusCode >= 200 && statusCode < 400) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(timeoutMs, () => {
      req.abort();
      reject(new Error('Request timed out'));
    });
  });
};