# frozen_string_literal: true

module Types
  module Ci
    # rubocop: disable Graphql/AuthorizeTypes
    class JobType < BaseObject
      graphql_name 'CiJob'

      field :pipeline, Types::Ci::PipelineType, null: false,
            description: 'Pipeline the job belongs to'
      field :name, GraphQL::STRING_TYPE, null: true,
            description: 'Name of the job'
      field :needs, JobType.connection_type, null: true,
            description: 'Builds that must complete before the jobs run'
      field :detailed_status, Types::Ci::DetailedStatusType, null: true,
            description: 'Detailed status of the job'
      field :scheduled_at, Types::TimeType, null: true,
            description: 'Schedule for the build'
      field :artifacts, Types::Ci::JobArtifactType.connection_type, null: true,
            description: 'Artifacts generated by the job'

      def pipeline
        Gitlab::Graphql::Loaders::BatchModelLoader.new(::Ci::Pipeline, object.pipeline_id).find
      end

      def detailed_status
        object.detailed_status(context[:current_user])
      end

      def artifacts
        if object.is_a?(::Ci::Build)
          object.job_artifacts
        end
      end
    end
  end
end