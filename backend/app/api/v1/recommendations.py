"""
YieldSense AI — Recommendations API Endpoints (Milestone 3)
"""

from fastapi import APIRouter, HTTPException

from app.schemas.recommendation import RecommendationEngineRequest, RecommendationEngineResponse
from app.services.recommendation_service import generate_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.post("/", response_model=RecommendationEngineResponse, summary="Generate agricultural recommendations")
async def get_recommendations(request: RecommendationEngineRequest):
    """
    Generate comprehensive agricultural recommendations based on crop,
    environmental conditions, and soil parameters.

    Returns:
    - Crop alternatives with suitability ratings
    - Fertilizer corrections (NPK) with application rates
    - Irrigation advice
    - Harvest suggestions
    - Season planning
    - Best farming practices
    - Yield improvement tips
    """
    try:
        result = generate_recommendations(request.model_dump())
        return RecommendationEngineResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")
