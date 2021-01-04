# frozen_string_literal: true

module BoardsActions
  include Gitlab::Utils::StrongMemoize
  extend ActiveSupport::Concern

  included do
    include BoardsResponses

    before_action :boards, only: :index
    before_action :board, only: :show
    before_action :push_licensed_features, only: [:index, :show]
    before_action do
      push_frontend_feature_flag(:not_issuable_queries, parent, default_enabled: true)
    end
  end

  def index
    respond_with_boards
  end

  def show
    # Add / update the board in the recent visits table
    Boards::Visits::CreateService.new(parent, current_user).execute(board) if request.format.html?

    respond_with_board
  end

  private

  # Noop on FOSS
  def push_licensed_features
  end

  def boards
    strong_memoize(:boards) do
      Boards::ListService.new(parent, current_user).execute
    end
  end

  def board
    strong_memoize(:board) do
      boards.find(params[:id])
    end
  end

  def serializer
    BoardSerializer.new(current_user: current_user)
  end

  def serialize_as_json(resource)
    serializer.represent(resource, serializer: 'board', include_full_project_path: board.group_board?)
  end
end

BoardsActions.prepend_if_ee('EE::BoardsActions')
