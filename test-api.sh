#!/bin/bash

echo "🧪 Testing CGI Reader API..."

# Test backend health
echo "1. Testing backend health..."
if curl -s http://localhost:3002/ | grep -q "CGI Reader API"; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Test articles endpoint
echo "2. Testing articles endpoint..."
ARTICLES_RESPONSE=$(curl -s "http://localhost:3002/articles?limit=3")
if echo "$ARTICLES_RESPONSE" | grep -q "articles"; then
    echo "✅ Articles endpoint working"
    echo "📊 Found articles: $(echo "$ARTICLES_RESPONSE" | grep -o '"total":[0-9]*' | cut -d: -f2)"
else
    echo "❌ Articles endpoint failed"
    echo "Response: $ARTICLES_RESPONSE"
    exit 1
fi

# Test search endpoint
echo "3. Testing search endpoint..."
SEARCH_RESPONSE=$(curl -s "http://localhost:3002/articles?query=taxe")
if echo "$SEARCH_RESPONSE" | grep -q "articles"; then
    echo "✅ Search endpoint working"
else
    echo "❌ Search endpoint failed"
    echo "Response: $SEARCH_RESPONSE"
    exit 1
fi

# Test tags endpoint
echo "4. Testing tags endpoint..."
TAGS_RESPONSE=$(curl -s "http://localhost:3002/articles/tags")
if echo "$TAGS_RESPONSE" | grep -q "name"; then
    echo "✅ Tags endpoint working"
    echo "🏷️  Found tags: $(echo "$TAGS_RESPONSE" | grep -o '"name":"[^"]*"' | wc -l)"
else
    echo "❌ Tags endpoint failed"
    echo "Response: $TAGS_RESPONSE"
    exit 1
fi

# Test specific article
echo "5. Testing specific article..."
ARTICLE_RESPONSE=$(curl -s "http://localhost:3002/articles/1")
if echo "$ARTICLE_RESPONSE" | grep -q "articleNumber"; then
    echo "✅ Specific article endpoint working"
else
    echo "❌ Specific article endpoint failed"
    echo "Response: $ARTICLE_RESPONSE"
    exit 1
fi

echo ""
echo "🎉 All API tests passed!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3002"
echo "📚 API Documentation: http://localhost:3002/api"